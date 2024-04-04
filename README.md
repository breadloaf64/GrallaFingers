# GrallaFingers

This is a tool for me to add gralla finger diagrams to sheet music which have solfege as lyrics

## How to use

- install npm
- Clone this repo locally
- go to the project root folder and run `npm install`
- paste your sheet music PDF(s) into /fileIO/in
- run `npm start`
- modified PDF(s) with diagrams are written to /fileIO/out

## Assumptions

We need a PDF, containing solfege text (sol, la, si, do, re, mi, fa, sol'). Text in a line must share y values in the PDF. This will work if you made the PDF using musescore, and added the text as lyrics. There will need to be enough space between staves so that the diagrams do not overlap any existing content.

## Controls

In /src/consts.ts there are some editable values:

- SOLFEGE_SCALE | determines the exact string values that you use for your solfege. For instance, you could change "sol" to say "so" instead if you prefer.
- MIN_SOLFEGE_PER_LINE | A simple filter that stops diagrams being added in the wrong places. For instance, say your PDF includes the title "gralla music". The program will recognise "la" and "si" within that string and try to add diagrams. If we set a minimum amount of solfege per line greater than 2, then diagrams will not be added under the title.
- Y_SHIFT | Simply adjusts how far underneath the stave the diagrams sit.
