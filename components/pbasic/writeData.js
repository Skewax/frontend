import { MdTransferWithinAStation } from "react-icons/md";

class Flasher {
    constructor(port) {
        
        this.in = new Uint8Array()

        this.reading = true

        this.writer = port.writable.getWriter()
        this.reader = port.readable.getReader()
        this.port = port;
      //  this.reader = port.readable.getReader()

        // revisions
        this.revision = {
            name: 'BS2',
            challenge: new Uint8Array([0x42, 0x53, 0x32]),
            response: [190, 173, 206],
        }
    }
    async flush() {
        if(this.writer) {
            await this.writer.ready;
            await this.writer.close();
            this.writer = await this.port.writable.getWriter();
        }
    }

    async identifyBoard() {
        let data = this.revision.challenge
        for (var i=0; i < data.length; i++) {
            console.log("writing")
            console.log(data.slice(i, i+1))
            await this.writer.write(new Uint8Array(data.slice(i, i+1)))
            let bytesRead = 0
            let bytes = []
            while(bytesRead < 2) {
                const val = await this.reader.read()
                if(val) {
                    for(var j = 0; j < val.value.length; j++){
                        if(val.value[j]){
                            bytes.push(val.value[j])
                            bytesRead++
                        }
                    }
                }
            }
            if(bytes[1] === this.revision.response[i]){
            }
            else {
                console.log("invalid")
            }
        }
        await this.writer.write(new Uint8Array([0x00]))
        let bytesRead = 0
        let bytes = []
        while(bytesRead < 1) {
            const val = await this.reader.read()
            if(val) {
                for(var j = 0; j < val.value.length; j++){
                    if(val.value[j]){
                        bytes.push(val.value[j])
                        bytesRead++
                    }
                }
            }
        }
        console.log(bytes)
        return  
    }

    async resetBoard() {
        await this.port.setSignals({ break: true })
        await this.port.setSignals({ dataTerminalReady: false })
        await this.port.setSignals({ dataTerminalReady: true })
        await new Promise(r => setTimeout(r, 60))
        await this.port.setSignals({ break: false })
        await this.flush()
        return
    }

    async upload() {
        for(let i = 0; i < this.pb.PacketCount; i++) {
            let packet = this.pb.PacketBuffer.slice(i*18, i*18+18)
            await this.writer.write(Buffer.from(packet))
            console.log("sending")
            console.log(packet)
            let bytesRead = 0
            let bytes = []
            while(bytesRead < 19) {
                const val = await this.reader.read()
                if(val) {
                    for(var j = 0; j < val.value.length; j++){
                        bytes.push(val.value[j])
                        bytesRead++
                    }
                }
            }
            console.log("received")
            console.log(bytes)
        }
    }

   
    async flash(pb) {
        this.pb = pb
        await this.resetBoard()
        await this.identifyBoard()
        await this.upload()
        await this.writer.write(new Uint8Array([0x00]))
        await this.writer.releaseLock()
        await this.reader.releaseLock()      
    }


}


export default Flasher