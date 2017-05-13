
// import './styles/styles.less';

import React, {Component} from 'react';

import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/src/utils/customPropTypes';

import {FormControl} from 'material-ui/src/Form';
import {InputLabel} from 'material-ui/src/Input';

import Draft from 'draft-js';
import removeRangeFromContentState from 'draft-js/lib/removeRangeFromContentState';
var Immutable = require('immutable');
const URI = require('fbjs/lib/URI');
var DraftEntity = require('draft-js/lib/DraftEntity');
var {Editor, EditorState, RichUtils, CompositeDecorator, convertToRaw, convertFromRaw, ContentState, SelectionState, Modifier, convertFromHTML, genKey, ContentBlock} = Draft;

import IconButton from 'material-ui/src/IconButton';

import Send from 'material-ui-icons/Send';
import WaitIcon from 'material-ui-icons/HourglassEmpty';
import Create from 'material-ui-icons/Create';

const defaultProps = {
}

const styleSheet = createStyleSheet('Chips', (theme) => ({
  root: {

    '& .Editor': {

      // border: '1px solid',
      // marginTop: 16,

      '& .public-DraftEditor-content': {

        position: "relative",
        marginTop: 10,
        marginBottom: 10,
        minHeight: 20,
        padding: '6px 0',
        border: 'none',
        outline: 'none',
        borderBottom: `1px solid ${theme.palette.text.divider}`,

        '.error&': {

          borderBottom: `2px solid ${theme.palette.error[500]}`,
        },
      },
    },
  },
  input: {
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.secondary,
    lineHeight: 1,

    '.error &': {

      color: theme.palette.error[500],
    },
  },
}));

var classes;

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} rel="nofollow" target="_blank">
      {props.children}
    </a>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export default class RichTextEditor extends Component{

  constructor(props) {

    super(props);

    let editorState = this.initEditState(props.content);

    this.state = {
      editorState: editorState,
      id: props.id,
      readonly: !props.allow_edit,
      target_id: props.target_id || null,
      inEditMode: props.inEditMode || false,
      allow_edit: props.allow_edit || false,
      clearOnSave: props.clearOnSave || false,
      images: [],
      isDirty: false,
      lastModified: null,
      errors: {},
      show_message: "",
      sending: false,
    };

    this._blockRenderer = (block) => {
      if (block.getType() === 'atomic') {

      }

      return null;
    };
  }

  initEditState(content){
    var editorState;

    var state = null;

    if(content && typeof content == "string"){

      /*
       * Пытаемся распарсить JSON
       * */
      try{
        var json = JSON.parse(content);

        if(json){
          content = json;
        }
      }
      catch(e){

      }

      if(!content.blocks){
        if(typeof window != "undefined"){
          var blocks = convertFromHTML(content);
          state = ContentState.createFromBlockArray(blocks);
        }
      }
    }

    if(!state && content && content.blocks){
      state = convertFromRaw(content);
    }

    if(state){
      editorState = EditorState.createWithContent(state);
    }
    else{
      editorState = EditorState.createEmpty();
    }

    return EditorState.set(editorState, {decorator: decorator});
  }

  Save(){

    console.log('Save');

    if(this.onSave){
      this.onSave();
    }
  }

  startEdit(){

    this.setState({
      inEditMode: true,
    });

    this.onChange(this.state.editorState);
  }

  clearError(){
    this.setState({
      errors: {},
    });
  }

  onChange(editorState){

    console.log('onChange', editorState);

    if(this.props.onChange){
      var currentContent = editorState.getCurrentContent();
      var text = JSON.stringify(convertToRaw(currentContent));
      var plainText = currentContent.getPlainText()
      this.props.onChange(editorState, text, plainText);
    }

    this.setState({editorState});
  }
  // componentWillReceiveProps(nextProps){
  //
  //   if(nextProps.value != this.props.value){
  //     this.setState({
  //       value: nextProps.value,
  //     });
  //   }
  // }

  componentWillMount(){
    classes = this.context.styleManager.render(styleSheet);
  }

  render(){

    let {editorState} = this.state;
    let currentContent = editorState.getCurrentContent();
    var plainText = currentContent.getPlainText();

    var sendButton, editButton;

    if(this.state.allow_edit){
      if(this.state.inEditMode){
        sendButton = <IconButton
          onTouchTap={() => this.Save()}
        >
          {this.state.sending !== true
            ?
            <Send
              color={this.state.isDirty === true ? 'red' : '#8080FF'}
            />
            :
            <WaitIcon
              color="grey"
            />
          }

        </IconButton>;
      }
      else{
        editButton = <IconButton
          onTouchTap={() => this.startEdit()}>
          <Create/>
        </IconButton>;
      }
    }

    return <FormControl
      error={this.props.error}
      className={["textarea", classes.root, this.props.error ? "error" : ""].join(" ")}
    >
      {this.props.label != ""
        ?
        <InputLabel
          shrink={plainText != ""}
          className={classes.inputLabel}
        >
          {this.props.label}
        </InputLabel>
        :
        null}

      <div
        className="Editor"
      >
        <Editor
          editorState={editorState}
          // blockRendererFn={this._blockRenderer}
          // blockRenderMap={extendedBlockRenderMap}
          // handleKeyCommand={this._handleKeyCommand}
          // handlePastedText={this._handlePastedText.bind(this)}
          // handleDroppedFiles={this.handleDroppedFiles}
          // handleDrop={this.handleDrop}
          onChange={(newState) => this.onChange(newState)}
          onFocus={(event) => {
            if(this.props.onFocus){
              event.target.name = this.props.name;
              this.props.onFocus(event);
            }
          }}
          onTab={this.onTab}
          // customStyleMap={styleMap}
          placeholder=""
          spellCheck={true}
          readOnly={!this.state.inEditMode || this.state.readonly}
        />
      </div>

    </FormControl>;
  }
}

RichTextEditor.defaultProps = defaultProps;
RichTextEditor.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};