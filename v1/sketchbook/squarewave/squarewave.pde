int xInterval = 80;
int yInterval = 5;
int numPos = 15;
int numLines;
color c = color(240, 240, 240);
float startY;
//2D array of y values for each line at each spacing point
float[][] positions;
float lowerBound, upperBound;
float [] speeds;
int mvtFactor = 2;

void setup() {
  size(xInterval*(numPos-1), 400);
  startY = height/4;
  background(#333333);
  numLines = height/2/yInterval;
  positions = new float[numPos][numLines];
  speeds = new float[numPos];
  for (int i=0; i<numPos; i++) {
    speeds[i] = (random(-1,1));
  }
  lowerBound=-height/16;
  upperBound=9*height/16;
  initPositions();
  smooth();
}

void draw() {
  background(#333333);
  wavePositions();
  renderWave();
}

void initPositions() {
  float y = 0;
  float dy = 0;
  //initialize the 2D array  
  for (int i=0; i<numPos; i++) { 
    for (int j=0; j<numLines; j++) {
      positions[i][j]=y;
      y+=yInterval;
    }
    dy = float(random(-1.5,1.5));
    y=dy*xInterval;
  }
}

void wavePositions() {
  float y;
  mvtFactor=int(random(1,2));
  for (int i=0; i<numPos; i+=mvtFactor) {
    y = positions[i][0]; 
    if (((y+startY) < lowerBound) || ((y+startY) > upperBound)) {
      speeds[i]=-speeds[i];
    }
    y+=speeds[i];    
    for (int j=0; j<numLines; j++) {
      positions[i][j]=y;
      y+=yInterval;
    }
  }
}

void renderWave() {
  color cZero = color(240, 240, 240);
  color cPos = color(165, 165, 165);
  color cNeg = color(255, 255, 255);
  for (int i=1; i<numPos; i++) {
    for (int j=1; j<numLines; j++) {
      if (positions[i][j] < positions[i-1][j-1]) {c = cNeg;}
      else if (positions[i][j] > positions[i-1][j-1]) {c = cPos;}
      else if (positions[i][j] == positions[i-1][j-1]) {c = cZero;}
      stroke(c);
      strokeWeight(1);
      line((i-1)*xInterval, (startY + positions[i-1][j]), (i)*(xInterval), (startY + positions[i][j]));
    }
  }
  
}

