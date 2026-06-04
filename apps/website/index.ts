import { convertOneUploadedFile } from "gralla-fingers-converter-core/src/control";

function helloWorld() {
  const element= document.getElementById("hello-world");
  
  if (element) {
    element.textContent = "Hello, World!";
  }
}
helloWorld();

async function convertUploadedFile() {
  const fileInput = document.getElementById("file-input") as HTMLInputElement;
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    console.log("File uploaded:", file.name);
    await convertOneUploadedFile(file);
  } else {
    console.log("No file selected.");
  }
 }