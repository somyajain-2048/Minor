// import { storage } from "./firebase";
// import { uploadBytesResumable,getDownloadURL,ref } from "firebase/storage";

// const upload = async (file) =>{
// const date = new Date()
// const storageRef = ref(storage, `images/${date+file.name}`);
	
// 	const uploadTask = uploadBytesResumable(storageRef, file);
	
// return new Promise((resolve,reject) =>{


// 	uploadTask.on('state_changed', 
// 		(snapshot) => {
			
// 			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// 			console.log('Upload is ' + progress + '% done');
		
// 		}, 
// 		(error) => {
// 		   reject("Something went Wrong!" + error.code)
// 		}, 
// 		() => {
			
// 			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
// 				resolve(downloadURL)
// 			});
// 		}
	
//   	);
//   });
// };

// export default upload;


// import { storage } from "./firebase";
// import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";

// const upload = async (file) => {
//   if (!file) {
//     throw new Error("No file provided for upload.");
//   }

//   const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`; // Unique and safe file name
//   const storageRef = ref(storage, `images/${uniqueFileName}`);
//   const uploadTask = uploadBytesResumable(storageRef, file);

//   return new Promise((resolve, reject) => {
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log(`Upload is ${progress.toFixed(2)}% done`);
//       },
//       (error) => {
//         console.error("Upload failed:", error);
//         reject(`Something went wrong! Error: ${error.message}`);
//       },
//       async () => {
//         try {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           console.log("File available at", downloadURL);
//           resolve(downloadURL);
//         } catch (error) {
//           console.error("Failed to get download URL:", error);
//           reject("Failed to get download URL.");
//         }
//       }
//     );
//   });
// };

// export default upload;



import { storage } from "./firebase";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";


const upload = async (file) => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  try {
    // Create a unique and sanitized file name
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const storageRef = ref(storage, `images/${uniqueFileName}`);

    // Initialize the upload task
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress.toFixed(2)}% done`);
        },
        (error) => {
          console.error("Upload failed:", error.message);
          reject(`Upload failed. Error: ${error.message}`);
        },
        async () => {
          try {
            // Get the download URL once the upload is complete
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File successfully uploaded. URL:", downloadURL);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error fetching the download URL:", error.message);
            reject("Failed to retrieve the download URL.");
          }
        }
      );
    });
  } catch (error) {
    console.error("Unexpected error in upload function:", error.message);
    throw new Error("Unexpected error occurred during upload.");
  }
};

export default upload;
