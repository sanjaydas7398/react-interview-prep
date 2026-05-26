import { useState, useRef } from "react";
import { C } from "../constants";
import { Block, CodeBlock, Btn, Alert, Row, Grid } from "../shared";

export default function T11_Forms() {
  const [form, setForm] = useState({ name: "", email: "", role: "CONSULTANT", budget: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const uncontrolledRef = useRef();

  const validate = v => {
    const e = {};
    if (!v.name || v.name.length < 2) e.name = "Min 2 characters required";
    if (!v.email || !/\S+@\S+\.\S+/.test(v.email)) e.email = "Valid email required";
    if (!v.budget || isNaN(v.budget) || +v.budget <= 0) e.budget = "Must be a positive number";
    return e;
  };

  const set = field => val => {
    const next = { ...form, [field]: val };
    setForm(next);
    if (touched[field]) setErrors(validate(next));
  };
  const blur = field => () => { setTouched(p => ({ ...p, [field]: true })); setErrors(validate(form)); };

  const Field = ({ f, label, type = "text", placeholder, opts }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", color: C.textSub, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{label}</label>
      {opts
        ? <select value={form[f]} onChange={e => set(f)(e.target.value)} style={{ width: "100%", background: C.bgCode, border: `1px solid ${touched[f] && errors[f] ? C.red : C.border}`, borderRadius: 7, padding: "7px 10px", color: C.text, fontSize: 12, outline: "none" }}>
          {opts.map(o => <option key={o} value={o} style={{ background: C.bgCard }}>{o}</option>)}
        </select>
        : <input type={type} value={form[f]} onChange={e => set(f)(e.target.value)} onBlur={blur(f)} placeholder={placeholder}
          style={{ width: "100%", background: C.bgCode, border: `1px solid ${touched[f] && errors[f] ? C.red : C.border}`, borderRadius: 7, padding: "7px 10px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
      }
      {touched[f] && errors[f] && <div style={{ color: C.red, fontSize: 10, marginTop: 3 }}>⚠ {errors[f]}</div>}
    </div>
  );

  return (
    <div>
      <Grid cols={2} gap={12}>
        <Block title="Multi-Step Controlled Form + Validation" color={C.green}>
          {success ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 36 }}>✅</div>
              <div style={{ color: C.green, fontWeight: 700, marginTop: 8 }}>Form Submitted!</div>
              <Btn size="xs" style={{ marginTop: 10 }} onClick={() => { setSuccess(false); setStep(1); setTouched({}); setErrors({}); }}>Reset</Btn>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ flex: 1, height: 4, borderRadius: 99, background: s <= step ? C.green : C.border, transition: "background 0.3s" }} />
                ))}
              </div>
              <div style={{ color: C.textMuted, fontSize: 10, marginBottom: 12, fontFamily: C.mono }}>STEP {step} OF 3</div>
              {step === 1 && <><Field f="name" label="Full Name" placeholder="Ahmad bin Abdullah" /><Field f="email" label="Email" type="email" placeholder="ahmad@gov.my" /></>}
              {step === 2 && <><Field f="role" label="Role" opts={["CONSULTANT", "PROJECT_OWNER", "APPROVER", "ADMIN"]} /><Field f="budget" label="Budget (RM)" type="number" placeholder="5000000" /></>}
              {step === 3 && (
                <div>
                  <div style={{ background: C.bgCode, borderRadius: 8, padding: 12, marginBottom: 10 }}>
                    {Object.entries(form).map(([k, v]) => <div key={k} style={{ display: "flex", gap: 10, marginBottom: 4, fontSize: 12 }}><span style={{ color: C.textMuted, width: 70 }}>{k}:</span><span style={{ color: C.text }}>{v || "—"}</span></div>)}
                  </div>
                  <Alert type="info">Review and confirm your details above.</Alert>
                </div>
              )}
              <Row gap={8}>
                {step > 1 && <Btn variant="outline" onClick={() => setStep(s => s - 1)}>← Back</Btn>}
                {step < 3
                  ? <Btn style={{ flex: 1 }} onClick={() => { const errs = validate(form); if (step === 1) { setTouched({ name: true, email: true }); setErrors(errs); if (!errs.name && !errs.email) setStep(s => s + 1); } else setStep(s => s + 1); }}>Next →</Btn>
                  : <Btn variant="green" style={{ flex: 1 }} onClick={() => setSuccess(true)}>Submit ✓</Btn>
                }
              </Row>
            </>
          )}
        </Block>
        <div>
          <Block title="React Hook Form (Most Popular)" color={C.blue}>
            <Alert type="info">React Hook Form uses <strong>uncontrolled inputs</strong> internally → minimal re-renders → very fast performance.</Alert>
            <CodeBlock code={[
              { t: "const { register, handleSubmit, formState: { errors } } = useForm({", c: C.blue },
              { t: "  resolver: zodResolver(schema),", c: C.textSub },
              { t: "});", c: C.blue },
              { t: "", c: "" },
              { t: "<form onSubmit={handleSubmit(onSubmit)}>", c: C.textSub },
              { t: "  <input {...register('email', { required: 'Required' })}/>", c: C.green },
              { t: "  {errors.email && <p>{errors.email.message}</p>}", c: C.red },
              { t: "</form>", c: C.textSub },
            ]} />
          </Block>
          <Block title="Zod Validation" color={C.yellow}>
            <CodeBlock code={[
              { t: "const schema = z.object({", c: C.cyan },
              { t: "  email: z.string().email(),", c: C.textSub },
              { t: "  budget: z.number().positive(),", c: C.textSub },
              { t: "});", c: C.cyan },
              { t: "type FormData = z.infer<typeof schema>; // auto type!", c: C.green },
            ]} />
          </Block>
          <Block title="Uncontrolled Form" color={C.orange}>
            <input ref={uncontrolledRef} defaultValue="Initial value" style={{ width: "100%", background: C.bgCode, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 10px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
            <Btn size="xs" onClick={() => alert(`Value: "${uncontrolledRef.current?.value}"`)}>Read Ref on Submit</Btn>
          </Block>
        </div>
      </Grid>

      <Grid cols={2} gap={12}>
        <Block title="Formik — Classic Form Library" color={C.blue}>
          <Alert type="info">**Formik** is a popular library for managing form state, handling validation, and submission.</Alert>
          <CodeBlock code={[
            { t: "<Formik", c: C.blue },
            { t: "  initialValues={{ email: '' }}", c: C.textSub },
            { t: "  onSubmit={values => console.log(values)}", c: C.textSub },
            { t: "  validationSchema={YupSchema}", c: C.yellow },
            { t: ">", c: C.blue },
            { t: "  {({ errors, touched }) => (", c: C.textSub },
            { t: "    <Form>", c: C.textSub },
            { t: "      <Field name='email' />", c: C.green },
            { t: "      {errors.email && touched.email && <div>{errors.email}</div>}", c: C.red },
            { t: "    </Form>", c: C.textSub },
            { t: "  )}", c: C.textSub },
            { t: "</Formik>", c: C.blue },
          ]} />
        </Block>
        <Block title="Yup — Schema Validation" color={C.yellow}>
          <Alert type="info">**Yup** is often used with Formik for schema-based validation.</Alert>
          <CodeBlock code={[
            { t: "const schema = Yup.object().shape({", c: C.yellow },
            { t: "  email: Yup.string()", c: C.textSub },
            { t: "    .email('Invalid email')", c: C.textSub },
            { t: "    .required('Required'),", c: C.red },
            { t: "  age: Yup.number().positive().integer(),", c: C.textSub },
            { t: "});", c: C.yellow },
          ]} />
        </Block>
        <Block title="File Uploads in Forms" color={C.cyan}>
          <Alert type="info">Handling file uploads requires using **FormData** and setting the correct headers.</Alert>
          <CodeBlock code={[
            { t: "const onFileChange = (e) => {", c: C.cyan },
            { t: "  const file = e.target.files[0];", c: C.textSub },
            { t: "  const formData = new FormData();", c: C.green },
            { t: "  formData.append('file', file);", c: C.textSub },
            { t: "", c: "" },
            { t: "  await axios.post('/upload', formData, {", c: C.textSub },
            { t: "    headers: { 'Content-Type': 'multipart/form-data' }", c: C.yellow },
            { t: "  });", c: C.textSub },
            { t: "};", c: C.cyan },
            { t: "", c: "" },
            { t: "<input type='file' onChange={onFileChange} />", c: C.green },
          ]} />
        </Block>
      </Grid>
    </div>
  );
}
