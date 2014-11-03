int numCircs = 192;
float thetaInt = TWO_PI/numCircs;
float offset = 10;
float offsetOriginal = 10;
float d = 100;
float amt, amtInv;
boolean on = true;
float angle = 0;
float angle_rot;
int[] dVals = new int[numCircs];
float cx1mag = 2;
float cy1mag = 1;
float cx2mag = 60;
float cy2mag = 1;
float x2mag = 40;
float y2mag = 2;
float distance;
float delta = 0.02;
float mouseCentered = 1000;




void setup() {
  frameRate(30);
  size(1000, 1000);
  ellipseMode(RADIUS);
  smooth();
  for (int i=0; i<numCircs; i++) {
    dVals[i] = int(random(100, 200));
  }
}

void draw() {
  background(#FFFFFF);  
  color c = color(#8acff2);
  noFill();
  angle_rot = 0;
  amt = sin(angle);
  amtInv = cos(angle);
  
  mouseCentered = (sqrt(sq(mouseX-(width/2))+sq(mouseY-(height/2))));
  
  if (mouseCentered < 800 ) {
    if (cx2mag < 1000) {
      cx2mag*=1.01;
      cx1mag*=1.001;
      distance = (sqrt(sq(width/2)+sq(height/2)))-sqrt(sq(width/2-amt*100)+sq(height/2-amt*100));
      offset=lerp(offset, offsetOriginal+distance/2.5, .01);
      delta=constrain(delta+=0.001, 0.019, 0.05);
    }
    else { }
  } else if (mousePressed == false) {
    cx2mag=lerp(cx2mag, 60, .08);
    cx1mag=lerp(cx1mag, 2, .08);    
    offset=lerp(offset, offsetOriginal, .01);
    delta=lerp(delta, 0.02, .03);
  }
  
	translate(400, 280);

  for(int i=0; i<numCircs; i++) {
    d = dVals[i];
    pushMatrix();
    rotate(angle_rot);
    stroke(c);
    strokeWeight(0.5);
  //bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);    
    bezier(offset, offset, offset+cx1mag*amt, offset*cy1mag, offset-cx2mag*amt, offset+cy2mag*(d/3), offset-x2mag*amt, offset+d+y2mag*amtInv);
    popMatrix();
    angle_rot += thetaInt;
  }
  angle += delta;
}



