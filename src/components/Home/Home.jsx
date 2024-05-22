import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../api/firebase";
import { signOut } from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Logo from "../../assets/dropbox_logo.svg";
import "./Home.css";
import Loader from "../loader/Loader";

const Home = () => {
  const fileTypeIcons = {
    png: "https://www.svgrepo.com/show/424855/png-file-type.svg",
    wav: "https://www.svgrepo.com/show/424843/wav-file-type.svg",
    txt: "https://www.svgrepo.com/show/424845/txt-file-type.svg",
    excel: "https://www.svgrepo.com/show/424846/excel-file-type.svg",
    csv: "https://www.svgrepo.com/show/424848/csv-file-type.svg",
    css: "https://www.svgrepo.com/show/424849/css-file-type.svg",
    word: "https://www.svgrepo.com/show/424850/word-file-type.svg",
    mp3: "https://www.svgrepo.com/show/424851/mp3-file-type.svg",
    jpg: "https://www.svgrepo.com/show/424854/jpg-file-type.svg",
    jpeg: "https://www.svgrepo.com/show/424854/jpg-file-type.svg",
    mov: "https://www.svgrepo.com/show/424856/mov-file-type.svg",
    rar: "https://www.svgrepo.com/show/424857/rar-file-type.svg",
    zip: "https://www.svgrepo.com/show/424858/zip-file-type.svg",
    undefined: "https://www.svgrepo.com/show/424859/other-file-type.svg",
    html: "https://www.svgrepo.com/show/424861/html-file-type.svg",
    pdf: "https://www.svgrepo.com/show/424860/pdf-file-type.svg",
    folder: "https://www.svgrepo.com/show/522403/folder.svg",
    returnFolder: "https://icons.veryicon.com/png/o/folder/folder-series/folder-tree-1.png",
  };

  const [img, setImg] = useState("");
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState(auth.currentUser.uid);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderForm, setNewFolderForm] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("parentId", "==", currentDirectory)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setFiles(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return () => unsubscribe();
  }, [currentDirectory]);

  const toggleForm = () => {
    setForm(!form);
  };

  const toggleNewFolderForm = () => {
    setNewFolderForm(!newFolderForm);
  };

  const handleFolderClick = (folder) => {
    setCurrentDirectory(folder.fileId);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
      })
      .catch((err) => {
        console.error("Error signing out:", err);
      });
  };

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
    handleClick(e);
  };

  const handleNewFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const handleClick = async (event) => {
    event.preventDefault();
    if (!img) {
      console.error("No image to upload");
      return;
    }

    setIsUploading(true);

    const imgRef = ref(storage, `files/${img.name + v4()}`);
    try {
      setForm(!form);
      const snapshot = await uploadBytes(imgRef, img);
      const fileUrl = await getDownloadURL(snapshot.ref);
      await addDoc(collection(db, "users"), {
        userId: auth.currentUser.uid,
        fileId: snapshot.ref.name,
        fileUrl,
        fileName: img.name,
        fileType: img.type,
        parentId: currentDirectory,
      });

      console.log("Uploaded a blob or file!", snapshot);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false); // Set isUploading to false
    }
  };

  const handleNewFolder = async (event) => {
    event.preventDefault();
    if (!newFolderName) {
      console.error("No folder name");
      return;
    }

    try {
      toggleNewFolderForm();
      await addDoc(collection(db, "users"), {
        userId: auth.currentUser.uid,
        fileId: v4(),
        fileName: newFolderName,
        fileType: "folder",
        fileUrl: "#", // Add a dummy value for fileUrl
        parentId: currentDirectory,
      });

      console.log("Created a new folder");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleDelete = async (id) => {
    const userDoc = doc(db, "users", id);
    const fileId = files.find((file) => file.id === id).fileId;
    const fileRef = ref(storage, `files/${fileId}`);

    try {
      await deleteObject(fileRef);
      await deleteDoc(userDoc);
      console.log("File and document deleted successfully");
    } catch (error) {
      console.error("Error deleting file and document:", error);
    }
  };

  if (isUploading) {
    return <Loader />;
  }

  return (
    <div>
      <nav className="blue">
        <div className="nav-wrapper container">
          <a href="/" className="brand-logo ">
            <img src={Logo} alt="" />
          </a>
          <ul className="right hide-on-small-and-down">
            <li>
              <a href="#!" onClick={toggleNewFolderForm}>
                Add folder <i className="material-icons right">create_new_folder</i>
              </a>
            </li>
            <li>
              <a href="#!" onClick={toggleForm}>
                Add File <i className="material-icons right">add</i>
              </a>
            </li>
            <li onClick={handleSignOut}>
              <a href="#!">
                Logout<i className="material-icons right">logout</i>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="main_container">
        <br />
        <br />
        {form && (
          <div className="form-container">
            <form action="#" className="container">
              <div className="row">
                <div
                  className="col s12 m8 offset-m2 white"
                  style={{ padding: "50px 50px" }}
                >
                  <p className="special_btn" onClick={toggleForm}>
                    <i className="material-icons">close</i>
                  </p>
                  <h1 className="center" style={{ margin: "1px" }}>
                    Add File
                  </h1>
                  <div className="file-field input-field">
                    <div className="btn">
                      <span>File</span>
                      <input
                        type="file"
                        name="my-file"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                    </div>
                  </div>
                  <div className="input-field">
                    <button
                      type="submit"
                      className="btn"
                      onClick={(event) => handleClick(event)}
                      disabled={!img}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {newFolderForm && (
          <div className="form-container">
            <form action="#" className="container">
              <div className="row">
                <div
                  className="col s12 m8 offset-m2 white"
                  style={{ padding: "50px 50px" }}
                >
                  <p className="special_btn" onClick={toggleNewFolderForm}>
                    <i className="material-icons">close</i>
                  </p>
                  <h1 className="center" style={{ margin: "1px" }}>
                    Add Folder
                  </h1>
                  <div className="input-field">
                    <input
                      type="text"
                      name="new-folder-name"
                      value={newFolderName}
                      onChange={handleNewFolderNameChange}
                    />
                  </div>
                  <div className="input-field">
                    <button
                      type="submit"
                      className="btn"
                      onClick={(event) => handleNewFolder(event)}
                      disabled={!newFolderName}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="files_container" style={{ width: "90%", margin: "1px auto" }}>
          <div className="row">
            {files.map((file) =>
              file.fileType === "folder" && (
                <div
                  className="col s6 m4 l2"
                  style={{ padding: "0px 10px" }}
                  key={file.id}
                  onClick={() => handleFolderClick(file)}
                >
                  <div className="card files_card">
                    <img src={fileTypeIcons["folder"]} alt="folder" />
                    <a href="#!">{file.fileName}</a>
                  </div>
                </div>
              )
            )}
            {files.map((file) =>
              file.fileType !== "folder" && (
                <div className="col s6 m4 l2" style={{ padding: "0px 10px" }} key={file.id}>
                  <div className="card files_card">
                    {fileTypeIcons[file.fileType.split("/")[1]] && (
                      <img src={fileTypeIcons[file.fileType.split("/")[1]]} alt="" />
                    )}
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textWrap: "wrap" }}
                    >
                      {file.fileName}
                    </a>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <a
                        href="#!"
                        className="btn blue white-text"
                        onClick={() => handleDownload(file.fileUrl)}
                      >
                        <i className="material-icons">download</i>
                      </a>
                      <a
                        href="#!"
                        className="btn red white-text"
                        onClick={() => handleDelete(file.id)}
                      >
                        <i className="material-icons">delete</i>
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
