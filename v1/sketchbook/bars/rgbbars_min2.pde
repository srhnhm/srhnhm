int chosenWidth = 400;
int w = 1;
int h = 40;
int gutter = 1;
int rows = 20;
int each = 20;
int numLines = rows*each;
int[] xvals = new int[numLines];
int[] yvals = new int[numLines];
int[] intervals = new int[numLines];
int transparency = 10;
int[][] hues = new int[numLines][4];

void setup() {
  int calcHeight=rows*h+(rows-1)*gutter;
  size(chosenWidth, calcHeight); 
  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 100, 100);
  
  for (int i=0; i<numLines; i++) {
    xvals[i] = int(random(width));
    intervals[i] = int(random(2, 10)); 
    yvals[i]= (h+gutter)*(floor(i/each));
  }
  
  for (int r=0; r<hues.length; r++) {
      hues[r][0]= int(random(360));
      hues[r][1] = int(random(90, 100));
      hues[r][2] = int(random(90, 100));
      hues[r][3] = transparency;
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

