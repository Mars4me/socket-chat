import LongPulling from './LongPulling';
import EventSourcesing from './EventSourcesing';
import Websocket from './Websocket';
import Parallax from './Parallax';

function App() {
    return (
        <>
            {/* <LongPulling /> */}
            {/* <EventSourcesing /> */}

            <Parallax>
                <Websocket />
            </Parallax>
        </>
    );
}

export default App;
