import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS17_Design_Patterns() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Creational: Singleton & Factory" color={C.green}>
        <Alert type="info">Design patterns are reusable solutions to common problems in software design.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <div style={{ color: C.green, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Singleton Pattern</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 10 }}>Ensures a class has only ONE instance and provides a global point of access.</div>
            <CodeBlock code={[
              { t: "const Database = (function() {", c: C.green },
              { t: "  let instance;", c: C.textSub },
              { t: "  return {", c: C.textSub },
              { t: "    getInstance: () => instance || (instance = new DB())", c: C.green },
              { t: "  };", c: C.textSub },
              { t: "})();", c: C.green },
            ]} />
          </div>
          <div>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Factory Pattern</div>
            <div style={{ color: C.textSub, fontSize: 10, marginBottom: 10 }}>Creates objects without specifying the exact class of the object that will be created.</div>
            <CodeBlock code={[
              { t: "function UserFactory(role) {", c: C.blue },
              { t: "  if (role === 'admin') return new Admin();", c: C.textSub },
              { t: "  return new Guest();", c: C.textSub },
              { t: "}", c: C.blue },
            ]} />
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Structural: Module & Decorator" color={C.purple}>
          <div style={{ background: C.bgCode, padding: 12, borderRadius: 10, marginBottom: 10 }}>
            <div style={{ color: C.purple, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Module Pattern (Encapsulation)</div>
            <div style={{ color: C.textSub, fontSize: 9 }}>Uses closures to create private and public members.</div>
            <CodeBlock code={[
              { t: "const myModule = (() => {", c: C.purple },
              { t: "  let _private = 0;", c: C.textSub },
              { t: "  return { get: () => _private };", c: C.textSub },
              { t: "})();", c: C.purple },
            ]} />
          </div>
        </Block>
        <Block title="Behavioral: Observer (Pub/Sub) ⭐" color={C.orange}>
          <Alert type="info">A mechanism where multiple objects (subscribers) listen to events from a single source (publisher).</Alert>
          <CodeBlock code={[
            { t: "class EventEmitter {", c: C.orange },
            { t: "  events = {};", c: C.textSub },
            { t: "  on(evt, fn) { (this.events[evt] ||= []).push(fn); }", c: C.textSub },
            { t: "  emit(evt, data) { this.events[evt]?.forEach(fn => fn(data)); }", c: C.green },
            { t: "}", c: C.orange },
          ]} />
          <div style={{ color: C.textMuted, fontSize: 9, marginTop: 4 }}>Used extensively in frameworks like Vue and Node.js.</div>
        </Block>
        <Block title="Revealing Module Pattern" color={C.cyan}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>A variation of the module pattern where you only return references to private members.</div>
          <CodeBlock code={[
            { t: "const repo = (() => {", c: C.cyan },
            { t: "  const _db = [];", c: C.textSub },
            { t: "  const add = (i) => _db.push(i);", c: C.textSub },
            { t: "  return { add }; // reveals add, hides _db", c: C.green },
            { t: "})();", c: C.cyan },
          ]} />
        </Block>
        <Block title="Command Pattern" color={C.yellow}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Encapsulate a request as an object, allowing you to parameterize clients with different requests.</div>
          <CodeBlock code={[
            { t: "const Manager = {", c: C.yellow },
            { t: "  execute: (name, ...args) => Commands[name](...args)", c: C.textSub },
            { t: "};", c: C.yellow },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
