# GrallaFingers

This is a tool for adding gralla finger diagrams to sheet music PDFs which have solfege as lyrics.

![image](https://github.com/breadloaf64/GrallaFingers/assets/60357301/71200d70-a759-4f89-8a93-0d28c4c266af)

## How to use

1. [install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
1. Clone this repo locally
1. go to the project root folder and run `npm install`
1. in the project root, add a folder called "fileIO". Inside that folder add a folder called "in" and a folder called "out"
1. paste your sheet music PDF(s) into /fileIO/in
1. run `npm start`
1. modified PDF(s) with diagrams are written to /fileIO/out

## Assumptions

We need a PDF, containing solfege text (sol, la, si, do, re, mi, fa, sol'). Text in a line must share y values in the PDF. This will work if you made the PDF using musescore, and added the text as lyrics. There will need to be enough space between staves so that the diagrams do not overlap any existing content.

If there is a typo in your solfege, that note will be ignored!

## Controls

In /src/consts.ts there are some editable values:

- `SOLFEGE_SCALE` | determines the exact string values that you use for your solfege. For instance, you could change "sol" to say "so" instead if you prefer.
- `MIN_SOLFEGE_PER_LINE` | A simple filter that stops diagrams being added in the wrong places. For instance, say your PDF includes the title "gralla music". The program will recognise "la" and "si" within that string and try to add diagrams. If we set a minimum amount of solfege per line greater than 2, then diagrams will not be added under the title.
- `Y_SHIFT` | Simply adjusts how far underneath the stave the diagrams sit.
