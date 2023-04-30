import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';


interface Props {
    content: string;
  }
  
  const RichTextPreview: React.FC<Props> = ({ content }) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };
  
  export default RichTextPreview;
  
