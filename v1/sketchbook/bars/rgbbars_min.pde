int w = 2;
int h = 120;
int gutter = 5;
int rows = 3;
int each = 3;
int numLines = rows*each;
int[] xvals = new int[numLines];
int[] yvals = new int[numLines];
int[] intervals = new int[numLines];

//had to make a 2D array for the colors instead of a color[] because of the fourth transparency value
int transparency = 30;
int[][] hues = {
    {0, 100, 100, transparency}, //red
    {112, 100, 100, transparency}, //green
    {231, 100, 100, transparency}, //blue
    {0, 0, 0, transparency}, //black
    {0, 0, 25, transparency}, //lightgray
    {0, 0, 60, transparency}, //darkgray
    {179, 100, 100, transparency}, //cyan
    {299, 100, 100, transparency}, //magenta
    {59, 100, 100, transparency} //yellow
   };

void setup() {
  int chosenWidth = 400;
  int calcHeight=rows*h+(rows-1)*gutter;
  size(chosenWidth, calcHeight); 
  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 100, 100);
  
  for (int i=0; i<numLines; i++) {
    xvals[i] = int(random(width));
    intervals[i] = int(random(3, 10)); 
    yvals[i]= (h+gutter)*(floor(i/3));
  }
  

}

void draw() {
  
  for (int n=0; n<numLines; n++) {
    fill(hues[n][0], hues[n][1], hues[n][2], hues[n][3]);
    noStroke();
    rect(xvals[n], yvals[n], w, h); 
    xvals[n]+=intervals[n];
    if ( (xvals[n]+w) >= width || xvals[n] <= 0) {
      intervals[n] = -intervals[n];
    }
    
  }

  fill(0, 0, 100, 5);
  rect(0, 0, width, height); 
  
}

