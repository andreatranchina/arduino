#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into digital pin 2 on the Arduino
#define ONE_WIRE_BUS 2

#define Liquid_Detection_Pin 7 // Output pin on sensor

// Setup a oneWire instance to communicate with any OneWire device
OneWire oneWire(ONE_WIRE_BUS);

// Pass oneWire reference to DallasTemperature library
DallasTemperature sensors(&oneWire);

// LED vars
// const int ledPin = 13;
const int ledPin = 11;
const int ledPin2 = 12;
const int pwmPin = 3;
const int tempPin = 2;
const int waterPin = 7;

// LED read vars
String inputString = "";         // a string to hold incoming data
boolean toggleComplete = false;  // whether the string is complete
boolean toggleComplete2 = false; // for input 2
boolean pwmComplete = false;

// Potmeter vars
const int analogInPin = A0;
int sensorValue = 0; // value read from the potmeter
int prevValue = 0;   // previous value from the potmeter

int temperature = 0;

void setup()
{
  sensors.begin(); // Start up the library

  // initialize serial:
  Serial.begin(9600);
  // init LEDS
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(pwmPin, OUTPUT);
  pinMode(Liquid_Detection_Pin, INPUT);
  digitalWrite(ledPin, 1);
  digitalWrite(ledPin2, 1);
  analogWrite(pwmPin, 0);
  digitalWrite(waterPin, "water");
}

void loop()
{
  // Send the command to get temperatures
  sensors.requestTemperatures();

  // print the temperature in Celsius
  Serial.print("Temperature: ");
  Serial.print(sensors.getTempCByIndex(0));
  Serial.print((char)176); // shows degrees character
  Serial.print("C  |  ");

  // print the temperature in Fahrenheit
  Serial.print((sensors.getTempCByIndex(0) * 9.0) / 5.0 + 32.0);
  Serial.print((char)176); // shows degrees character
  Serial.println("F");

  // delay(500);

  // Recieve data from Node and write it to a String
  while (Serial.available() && toggleComplete == false && toggleComplete2 == false && pwmComplete == false)
  {
    char inChar = (char)Serial.read();
    if (inChar == 'E')
    { // end character for led
      toggleComplete = true;
    }

    if (inChar == 'D')
    { // end character for led
      toggleComplete2 = true;
    }

    if (inChar == 'P')
    {
      pwmComplete = true;
    }
    else
    {
      inputString += inChar;
    }
  }

  //  // Recieve data from Node and write it to a String -> for input 2
  //  while (Serial.available() && toggleComplete2 == false && pwmComplete == false) {
  //   char inChar = (char)Serial.read();
  //   if(inChar == 'D'){ // end character for led
  //    toggleComplete2 = true;
  //   }
  //   if(inChar == 'P'){
  //     pwmComplete = true;
  //   }
  //   else{
  //     inputString += inChar;
  //   }
  // }

  // Toggle LED 13 - motor input 1
  if (!Serial.available() && toggleComplete == true)
  {
    // convert String to int.
    int recievedVal = stringToInt();

    if (recievedVal == 0)
    {
      digitalWrite(ledPin, recievedVal);
    }
    else if (recievedVal == 1)
    {
      digitalWrite(ledPin, recievedVal);
    }
    toggleComplete = false;
  }

  // toggle pin 12 - vigor input 2
  if (!Serial.available() && toggleComplete2 == true)
  {
    Serial.print("toggled2");
    // convert String to int.
    int recievedVal = stringToInt();

    if (recievedVal == 0)
    {
      digitalWrite(ledPin2, recievedVal);
    }
    else if (recievedVal == 1)
    {
      digitalWrite(ledPin2, recievedVal);
    }
    toggleComplete2 = false;
  }

  if (digitalRead(Liquid_Detection_Pin))
  {
    Serial.println("A_Liquid Detected!Z");
    digitalWrite(waterPin, "A_notsafeZ");
  }
  else
  {
    Serial.println("A_No Liquid!Z");
    digitalWrite(waterPin, "A_safeZ");
  }

  // Dim LED 3
  if (!Serial.available() && pwmComplete == true)
  {
    // convert String to int.
    int recievedVal = stringToInt();

    analogWrite(pwmPin, recievedVal);

    pwmComplete = false;
  }
  // Potmeter
  sensorValue = analogRead(analogInPin);
  // read the analog in value:
  if (prevValue != sensorValue)
  {
    Serial.print("B_1"); // begin character
    Serial.print(sensors.getTempCByIndex(0));
    Serial.print("E"); // end character
    prevValue = sensorValue;
  }
  delay(50); // give the Arduino some breathing room.
}

int stringToInt()
{
  char charHolder[inputString.length() + 1];
  inputString.toCharArray(charHolder, inputString.length() + 1);
  inputString = "";
  int _recievedVal = atoi(charHolder);
  return _recievedVal;
}