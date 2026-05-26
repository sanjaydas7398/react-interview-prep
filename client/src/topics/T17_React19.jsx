import { C_BASE } from "../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../shared";

export default function T17_React19() {
  const C = C_BASE;
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="React 19: The 'use' API 🎁" color={C.cyan}>
        <Alert type="info">React 19 introduces a new API to read resources like Promises or Context during render.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <CodeBlock code={[
              { t: "import { use } from 'react';", c: C.cyan },
              { t: "", c: "" },
              { t: "function UserProfile({ userPromise }) {", c: C.textSub },
              { t: "  const user = use(userPromise); // ✅ No useEffect needed", c: C.green },
              { t: "  return <div>{user.name}</div>;", c: C.textSub },
              { t: "}", c: C.textSub },
            ]} />
          </div>
          <div style={{ color: "inherit", fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: C.cyan, fontWeight: 700, marginBottom: 4 }}>Key Features:</div>
            • Can be used inside loops and conditionals. <br/>
            • Works with Suspense. <br/>
            • Simplifies data fetching patterns.
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Actions: useActionState" color={C.purple}>
          <div style={{ color: "inherit", fontSize: 10, marginBottom: 8 }}>The successor to `useFormState`. Handles form submissions and state updates.</div>
          <CodeBlock code={[
            { t: "const [state, action, isPending] = useActionState(", c: C.purple },
            { t: "  async (prev, formData) => {", c: C.textSub },
            { t: "    return await updateName(formData.get('name'));", c: C.textSub },
            { t: "  },", c: C.textSub },
            { t: "  null", c: C.textSub },
            { t: ");", c: C.purple },
          ]} />
        </Block>
        <Block title="useFormStatus" color={C.green}>
          <div style={{ color: "inherit", fontSize: 10, marginBottom: 8 }}>Access status of parent form without passing props.</div>
          <CodeBlock code={[
            { t: "const { pending, data, method } = useFormStatus();", c: C.green },
            { t: "", c: "" },
            { t: "return <button disabled={pending}>Submit</button>;", c: C.textSub },
          ]} />
        </Block>
        <Block title="Ref as a Prop" color={C.blue}>
          <div style={{ color: "inherit", fontSize: 10, marginBottom: 8 }}>No more `forwardRef`! Refs are now passed as regular props.</div>
          <CodeBlock code={[
            { t: "function MyInput({ placeholder, ref }) {", c: C.blue },
            { t: "  return <input placeholder={placeholder} ref={ref} />;", c: C.textSub },
            { t: "}", c: C.blue },
          ]} />
        </Block>
        <Block title="Document Metadata" color={C.orange}>
          <div style={{ color: "inherit", fontSize: 10, marginBottom: 8 }}>Native support for title/meta tags inside components.</div>
          <CodeBlock code={[
            { t: "function BlogPost({ post }) {", c: C.textSub },
            { t: "  return (", c: C.textSub },
            { t: "    <>", c: C.textSub },
            { t: "      <title>{post.title}</title>", c: C.orange },
            { t: "      <meta name='author' content='Me' />", c: C.orange },
            { t: "      <article>...</article>", c: C.textSub },
            { t: "    </>", c: C.textSub },
            { t: "  );", c: C.textSub },
            { t: "}", c: C.textSub },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
