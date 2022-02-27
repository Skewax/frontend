import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import AceEditor from 'react-ace';


const TextEditor = (props) => (
  <div className="flex-1 h-full">
    <AceEditor
        value={props.text}
        theme={props.theme}
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
        debounceChangePeriod={3000}
        focus={true}
    />
  </div>
)

export default TextEditor