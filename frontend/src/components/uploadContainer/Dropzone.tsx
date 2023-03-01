/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { Img, Box, Text } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

interface IMyDropZoneProps {
  imgLink: string;
  setImgLink: (binaryStr: string) => void;
}

function MyDropzone({ imgLink, setImgLink }: IMyDropZoneProps) {
  // const [imgLink, setImgLink] = useState("");
  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    const reader = new FileReader();
    const img = acceptedFiles[0];

    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      if (typeof binaryStr === "string") {
        setImgLink(binaryStr);
      }
    };
    reader.readAsDataURL(img);
  }, []);

  // eslint-disable-next-line no-unused-vars
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Box>
        {imgLink === "" ? (
          <Text
            padding=".3rem"
            height="10rem"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border=".15rem dotted gray"
          >
            Drag your post here !
          </Text>
        ) : (
          <Img w="70%" src={imgLink} margin="auto" />
        )}
      </Box>
    </div>
  );
}

export default MyDropzone;
