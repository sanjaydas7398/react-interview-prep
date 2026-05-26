import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS12_DOM_Events() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Event Delegation ⭐" color={C.green}>
        <Alert type="info">Instead of adding event listeners to hundreds of child elements, you add **ONE** listener to the parent and catch events as they bubble up.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock title="Delegation Example" code={[
              { t: "ul.onclick = (e) => {", c: C.green },
              { t: "  if (e.target.tagName === 'LI') {", c: C.textSub },
              { t: "    console.log(e.target.textContent);", c: C.green },
              { t: "  }", c: C.textSub },
              { t: "};", c: C.green },
            ]} />
          </div>
          <div style={{ color: C.textSub, fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.green, fontWeight: 700, marginBottom: 4 }}>Why Delegation?</div>
            • <strong>Memory Efficiency:</strong> Fewer listeners in memory.<br/>
            • <strong>Dynamic Elements:</strong> Works for children added LATER.<br/>
            • <strong>Clean Code:</strong> Centralized event handling.
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Bubbling vs Capturing" color={C.blue}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: C.orange + "10", padding: 10, borderRadius: 8 }}>
              <div style={{ color: C.orange, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>1. Capturing (Phase 1)</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Event goes DOWN from Window to Target.</div>
            </div>
            <div style={{ background: C.blue + "10", padding: 10, borderRadius: 8 }}>
              <div style={{ color: C.blue, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>2. Bubbling (Phase 3)</div>
              <div style={{ color: C.textSub, fontSize: 9 }}>Event goes UP from Target to Window. (Default)</div>
            </div>
          </div>
          <Spacer h={10} />
          <CodeBlock code={[
            { t: "e.stopPropagation(); // Stop bubbling", c: C.red },
            { t: "e.preventDefault();  // Stop default action", c: C.yellow },
          ]} />
        </Block>
        <Block title="DOM Selection & Creation" color={C.cyan}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              "querySelector('.btn')",
              "querySelectorAll('.items')",
              "getElementById('root')",
              "createElement('div')",
              "appendChild(el)",
              "insertAdjacentHTML('afterend', ...)",
            ].map(m => <div key={m} style={{ background: C.bgCode, padding: "5px 8px", borderRadius: 6, fontSize: 9, color: C.cyan, fontFamily: C.mono }}>.{m}</div>)}
          </div>
        </Block>
        <Block title="Attributes & Dataset" color={C.purple}>
          <CodeBlock code={[
            { t: "el.setAttribute('id', 'top');", c: C.textSub },
            { t: "el.classList.add('active');", c: C.green },
            { t: "", c: "" },
            { t: "// Custom data attributes", c: C.textMuted },
            { t: "<div data-id='123'></div>", c: C.yellow },
            { t: "el.dataset.id; // '123'", c: C.purple },
          ]} />
        </Block>
        <Block title="XSS & Content Security" color={C.red}>
          <Alert type="error">Avoid <Code>innerHTML</Code> with user-generated content! It is a primary vector for **XSS (Cross-Site Scripting)** attacks.</Alert>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: C.red + "15", padding: 8, borderRadius: 8 }}>
              <div style={{ color: C.red, fontSize: 9, fontWeight: 700 }}>❌ Dangerous</div>
              <div style={{ fontSize: 9, color: C.textSub, marginTop: 4 }}>el.innerHTML = userContent;</div>
            </div>
            <div style={{ flex: 1, background: C.green + "15", padding: 8, borderRadius: 8 }}>
              <div style={{ color: C.green, fontSize: 9, fontWeight: 700 }}>✅ Safe</div>
              <div style={{ fontSize: 9, color: C.textSub, marginTop: 4 }}>el.textContent = userContent;</div>
            </div>
          </div>
        </Block>
      </Grid>
    </div>
  );
}
