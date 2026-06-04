import { convertOneUploadedFile } from "gralla-fingers-converter-core/src/control";

function helloWorld() {
  const element= document.getElementById("hello-world");
  
  if (element) {
    element.textContent = "Hello, World!";
  }
}
helloWorld();

function buttonTest() {
  console.log("click!")
}

async function convertUploadedFile() {
  const fileInput = document.getElementById("file-input") as HTMLInputElement;

  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    console.log("No file selected.");
    return;
  }

  const file = fileInput.files[0];
  console.log("File uploaded:", file.name);
  const modified = await convertOneUploadedFile(file);
  downloadModifiedFile(modified, file.name);
}

function downloadModifiedFile(modified: Uint8Array, originalFileName: string) {
    const blob = new Blob([modified], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `converted-${originalFileName}`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
 }

const uploadButton = document.getElementById("upload-button");
uploadButton?.addEventListener("click", buttonTest);