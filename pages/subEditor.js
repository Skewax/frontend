import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import AceEditor from 'react-ace';


const TextEditor = (props) => (
  <div className="flex-1 h-full">
    <AceEditor
        mode={props.lan}
        theme={props.theme}
        onChange={props.onChange}
        name="mainEditor"
        editorProps={{
            $blockScrolling: true
        }}
        fontSize={16}
        width="100%"
        showPrintMargin={false}
        showGutter={true}
        height="100%"
    />
  </div>
)

export default TextEditor