/** A deterministic phrase-to-melody instrument; no text interpretation or remote model. */
export const TEXTURES=['glass','felt','dusk'];
export const escapeXml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function hash(text){let x=2166136261;for(const c of text){x^=c.codePointAt(0);x=Math.imul(x,16777619);}return x>>>0;}
export function compose(value,texture='glass'){
 if(typeof value!=='string'||!TEXTURES.includes(texture))throw Error('Choose a phrase and a known texture.');
 const phrase=[...value.normalize('NFKC').trim().replace(/\s+/g,' ')].slice(0,80).join('');if(!phrase)throw Error('Write a few words first.');
 const seed=hash(phrase),scale=[0,2,4,7,9],root=texture==='dusk'?48:texture==='felt'?55:60;let time=.12;const notes=[];
 for(const [i,c] of [...phrase].entries()){
  if(c===' '){time+=.16;continue;}
  const code=c.codePointAt(0),degree=(code+seed+i*3)%15,midi=root+scale[degree%5]+12*Math.floor(degree/5);
  notes.push({start:time,duration:texture==='glass'?.75:.55,frequency:440*2**((midi-69)/12),index:i});time+=.13+(code%3)*.025;
  if(notes.length>=48)break;
 }
 return {phrase,texture,seed,notes,duration:time+1.25};
}
export function synthesize(song,sampleRate=22050){
 if(!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>48000||!song?.notes||song.duration>20)throw Error('Unsupported audio parameters.');
 const samples=new Float32Array(Math.ceil(song.duration*sampleRate));
 const partials=song.texture==='glass'?[[1,1],[2.76,.28],[4.1,.1]]:song.texture==='felt'?[[1,1],[2,.16],[3,.045]]:[[1,1],[1.5,.15],[2,.07]];
 for(const note of song.notes){const start=Math.round(note.start*sampleRate),length=Math.floor(note.duration*sampleRate);for(let i=0;i<length&&start+i<samples.length;i++){const t=i/sampleRate,attack=Math.min(1,t/.012),release=Math.max(0,1-t/note.duration),envelope=attack*release**2*Math.exp(-t*(song.texture==='glass'?3:5));let v=0;for(const [ratio,amplitude] of partials)v+=Math.sin(2*Math.PI*note.frequency*ratio*t)*amplitude;samples[start+i]+=v*envelope*.15;}}
 let peak=0;for(const v of samples)peak=Math.max(peak,Math.abs(v));if(peak>.82)for(let i=0;i<samples.length;i++)samples[i]*=.82/peak;return samples;
}
export function wav(samples,rate=22050){const buffer=new ArrayBuffer(44+samples.length*2),view=new DataView(buffer);const put=(offset,s)=>{for(let i=0;i<s.length;i++)view.setUint8(offset+i,s.charCodeAt(i));};put(0,'RIFF');view.setUint32(4,buffer.byteLength-8,true);put(8,'WAVE');put(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);put(36,'data');view.setUint32(40,samples.length*2,true);for(let i=0;i<samples.length;i++)view.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),true);return buffer;}
export function sculpture(song,print=false){
 const colors=['#26314c','#b2c2a3','#f0aeb8','#26314c','#ded37a'];const variation=(song.seed%31)-15;
 let shapes='';for(let i=0;i<5;i++)shapes+=`<ellipse class="orbit orbit-${i}" cx="310" cy="235" rx="${220-i*24+(song.seed%7)}" ry="${150-i*17}" transform="rotate(${i*31-62+variation} 310 235)" fill="none" stroke="${colors[i]}" stroke-width="${23-i*2}"/>`;
 shapes+='<circle cx="310" cy="235" r="30" fill="#eff19b"/><circle cx="310" cy="235" r="6" fill="#26314c"/>';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${print?1240:620}" height="${print?1240:470}" viewBox="${print?'0 -60 620 620':'0 0 620 470'}" role="img" aria-label="An abstract sculpture shaped by your phrase">${print?'<rect x="0" y="-60" width="620" height="620" fill="#dcd6ee"/>':''}${shapes}${print?`<text x="310" y="515" text-anchor="middle" font-family="Georgia,serif" font-size="${song.phrase.length>40?11:17}" fill="#26314c">${escapeXml(song.phrase)}</text><text x="310" y="539" text-anchor="middle" font-family="monospace" font-size="8" fill="#45516b">MURMUR / ${song.texture.toUpperCase()} / A PHRASE-SHAPED MELODY</text>`:''}</svg>`;
}
