from flask import Flask, render_template, jsonify, request
import RPi.GPIO as GPIO
import time
app = Flask(__name__)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

STOP  = 0
FORWARD  = 1
BACKWARD = 2
speed = 0
 
CH1 = 0
CH2 = 1
 
ENL = 22
DIRL = 23
 
ENR = 26 
DIRR = 20

CW1 = 1     # Clockwise Rotation
CCW1 = 0    # Counterclockwise Rotation
#SPR = 200   # Steps per Revolution (360 / 1.8) <-- source code has 7.5 degree steps for SPR of 48.

Num = 0  

trig = 16
echo = 19

buzzer = 17

leftcarmera = 6
rightcarmera = 12


GPIO.setup(ENL, GPIO.OUT)
GPIO.setup(DIRL, GPIO.OUT)
GPIO.setup(ENR, GPIO.OUT)
GPIO.setup(DIRR, GPIO.OUT)
GPIO.setup(trig, GPIO.OUT)
GPIO.setup(echo, GPIO.IN)
GPIO.setup(buzzer, GPIO.OUT)
GPIO.setup(leftcarmera, GPIO.OUT)
GPIO.setup(rightcarmera, GPIO.OUT)

GPIO.output(leftcarmera, GPIO.LOW)
GPIO.output(rightcarmera, GPIO.LOW)

pwmL = GPIO.PWM(ENL, 100)
pwmR = GPIO.PWM(ENR, 100)

def allStop():
    GPIO.output(ENL, GPIO.LOW)
    GPIO.output(DIRL, GPIO.LOW)
    GPIO.output(ENR, GPIO.LOW)
    GPIO.output(DIRR, GPIO.LOW)

def forWard(speed):    
    pwmL.start(speed)
    GPIO.output(DIRL, GPIO.LOW)
    pwmR.start(speed)
    GPIO.output(DIRR, GPIO.LOW)

def backWard(speed):
    pwmL.start(speed)
    GPIO.output(DIRL, GPIO.HIGH)
    pwmR.start(speed)
    GPIO.output(DIRR, GPIO.HIGH)

def leftTurn(speed):
    pwmL.start(speed)
    GPIO.output(DIRR, GPIO.LOW)
    GPIO.output(ENL, GPIO.LOW)
    GPIO.output(DIRR, GPIO.LOW)
    
def rightTurn(speed):
    GPIO.output(ENR, GPIO.LOW)
    GPIO.output(DIRR, GPIO.LOW)
    pwmR.start(speed)
    GPIO.output(DIRL, GPIO.LOW)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ajax', methods=['POST'])
def ajax():
    data = request.get_json()
    dis = distance()
    if data['direction'] == 'c':
        clarkson()
    else:
        if data['speed'] < 5:
            carmove(data['direction'], data['speed'], dis)
        else:
            cameramove(data['speed'])
    return jsonify(result = "success", result2= dis)

@app.route('/ajax2', methods=['POST'])
def ajax2():
    data = request.get_json()
    dis = distance()
    if dis <= 20:
        if data['p'] != "s":
            pwmL.stop()
            pwmR.stop()
            allStop()
        else:
            sp = int(data['speed'])

            if(sp == 1): speed = 100
            elif(sp == 2): speed = 80
            elif(sp == 3): speed = 60
            elif(sp == 4): speed = 0
            backWard(speed)
    return jsonify(result = "success", result2= dis)

def carmove(direction, state, dis):
    state = int(state)

    if(state == 1): speed = 100
    elif(state == 2): speed = 80
    elif(state == 3): speed = 60
    elif(state == 4): speed = 0


    if direction == "x":
        pwmL.stop()
        pwmR.stop()
        allStop()
    elif direction == "w" and dis > 20:
        forWard(speed)
    elif direction == "s":
        backWard(speed)
    elif direction == "a" and dis > 20:
        leftTurn(speed)
    elif direction == "d" and dis > 20:
        rightTurn(speed)

def distance():
    GPIO.output(trig, False)
    time.sleep(0.00001)
    GPIO.output(trig, True)
    time.sleep(0.00001)
    GPIO.output(trig, False)
    pulse_start = 0
    while GPIO.input(echo) == 0:
        pulse_start = time.time()
    while GPIO.input(echo) == 1:
        pulse_end = time.time()
    pulse_duration = pulse_end - pulse_start
    dis = pulse_duration * 17000
    dis = round(dis, 2)
    return dis

def clarkson():
    pwm = GPIO.PWM(buzzer, 350)
    pwm.start(45.0)
    time.sleep(0.5)
    pwm.stop()

def cameramove(state):
    if(state == 5): #왼쪽으로 움직임
        GPIO.output(rightcarmera, GPIO.LOW)
        GPIO.output(leftcarmera, GPIO.HIGH)
    elif(state == 6): #오른쪽으로 움직임
        GPIO.output(leftcarmera, GPIO.LOW)
        GPIO.output(rightcarmera, GPIO.HIGH)
    elif(state == 7): #왼쪽으로 움직임을 멈춤
        GPIO.output(leftcarmera, GPIO.LOW)
    elif(state == 8): #오른쪽으로 움직임을 멈춤
        GPIO.output(rightcarmera, GPIO.LOW)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)