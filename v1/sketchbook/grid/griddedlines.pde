int w = 40;
int h = 40;
//keep it odd
int numCol = 17;
int numRow = 17;

int numSq = numCol*numRow;

int[] x = new int[numSq];
int[] y = new int[numSq];
int[][] centers = new int[numSq][2];
float [] hyps = new float[numSq];
int[] densities = new int[numSq];
float[] thetas = new float[numSq];
float[] deltaX = new float[numSq];
float[] deltaY = new float[numSq];

void setup() {

  int calWidth = numCol*w;
  int calHeight = numRow*h;
  size(calWidth, calHeight);  
  
  int i=0;
  for (int k=0; k<numRow; k++) {
    for (int j=0; j<numCol; j++) {
        x[i] = j*w;
        y[i] = k*h;
        centers[i][0] = x[i]+w/2;
        centers[i][1] = y[i]+h/2;
        i++;
    }
  }
  
}


void draw() {

  for (int i=0; i<numSq; i++) {
    noStroke();
    fill(#A5ABAF);
    rect(x[i], y[i], w, h);
    deltaX[i] = (abs(mouseX-centers[i][0]));   
    deltaY[i] = (abs(mouseY-centers[i][1]));
    hyps[i] = sqrt(sq(deltaX[i])+sq(deltaY[i]));
    
    densities[i]=int(hyps[i]/(w/2))+2;
  }
  
  
  for (int n=0; n<numSq; n+=2) {
    for (int j=x[n]; j<=(x[n]+w); j+=densities[n]) {
      stroke(#CDD3D3);
      strokeWeight(1);
      line(j, y[n], j, (y[n]+w));
    }
  }
  
  for (int m=1; m<numSq; m+=2) {
    for (int k=y[m]; k<=(y[m]+h); k+=densities[m]) {
      stroke(#CDD3D3);
      strokeWeight(1);
      line(x[m], k, (x[m]+h), k);
    }
  }    
    

   
}
  


  
  
  /*
   float startX = constrain(mouseX, x[0], (x[0]+w)); 
    float startY = constrain(mouseY, y[0], (y[0]+h));
    float endX = constrain((centers[0][0]-deltaX[0]), x[0], (x[0]+w));
    float endY = constrain((centers[0][1]-deltaY[0]), y[0], (y[0]+h));
    strokeWeight(1);
    stroke(#333333);
    line(startX, startY, endX, endY);   
  

*/


