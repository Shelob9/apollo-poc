import { registerBlockType } from "@wordpress/blocks";
import { InspectorControls } from "@wordpress/block-editor";
import { TextControl } from "@wordpress/components";
import React, { Fragment } from "react";
import ErrorMessage from "../Components/ErrorMessage";

const Display = ({ message, className }) => {
  return <ErrorMessage message={message} className={className} />;
};

const Editor = ({ message, onChange, className }) => {
  return (
    <TextControl
      label={"Change Message"}
      onChange={onChange}
      value={message}
      className={className}
    />
  );
};

const attributes = {
  message: {
    type: "string"
  }
};

const edit = ({ attributes, className, setAttributes }) => {
  const { message } = attributes;
  const onChange = message => setAttributes({ message });
  const props = { onChange, message, className };
  return (
    <Fragment>
      <InspectorControls>
        <Editor {...props} />
      </InspectorControls>
      <Display {...props} />
    </Fragment>
  );
};

const save = ({ attributes, className }) => {
  const { message } = attributes;
  const props = { message, className };
  return <Display {...props} />;
};

const name = "calderajs/message-block";
const options = {
  title: "Message block!",
  attributes,
  category: "common",
  edit,
  save
};
registerBlockType(name, options);
