import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/theme/cobalt';
import AceEditor from 'react-ace';


const TextEditor = (props) => (
  <div className="flex-1 h-full bg-green-100">
    <AceEditor
        value={props.text}
        theme="cobalt"
        onChange={props.onChange}
        name="mainEditor"
        editorProps={{
            $blockScrolling: true
        }}
        fontSize={16}
        showPrintMargin={false}
        width="100%"
        showGutter={true}
        height="100%"
        highlightActiveLine={false}
        focus={true}
    />
  </div>
)

export default TextEditor