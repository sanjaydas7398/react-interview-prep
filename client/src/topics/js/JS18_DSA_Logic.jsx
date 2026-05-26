import { C } from "../../constants";
import { Block, CodeBlock, Alert, Code, Grid, Tag, Spacer } from "../../shared";

export default function JS18_DSA_Logic() {
  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <Block title="Linear Structures: Stack & Queue" color={C.blue}>
        <Alert type="info">In JavaScript, we implementation these structures using Arrays or Objects.</Alert>
        <Grid cols={2} gap={15}>
          <div>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Stack (Last-In-First-Out)</div>
            <CodeBlock code={[
              { t: "class Stack {", c: C.blue },
              { t: "  items = [];", c: C.textSub },
              { t: "  push(e) { this.items.push(e); }", c: C.textSub },
              { t: "  pop() { return this.items.pop(); }", c: C.green },
              { t: "}", c: C.blue },
            ]} />
            <div style={{ color: C.textMuted, fontSize: 9, marginTop: 4 }}>Used for: Undo functionality, Call Stack, Recursion.</div>
          </div>
          <div>
            <div style={{ color: C.cyan, fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Queue (First-In-First-Out)</div>
            <CodeBlock code={[
              { t: "class Queue {", c: C.cyan },
              { t: "  items = [];", c: C.textSub },
              { t: "  enqueue(e) { this.items.push(e); }", c: C.textSub },
              { t: "  dequeue() { return this.items.shift(); }", c: C.orange },
              { t: "}", c: C.cyan },
            ]} />
            <div style={{ color: C.textMuted, fontSize: 9, marginTop: 4 }}>Used for: Task scheduling, Event Loop, Message passing.</div>
          </div>
        </Grid>
      </Block>

      <Grid cols={2} gap={12}>
        <Block title="Linked List (Manual Implementation)" color={C.green}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>A sequence of nodes where each node points to the next.</div>
          <CodeBlock code={[
            { t: "class Node {", c: C.green },
            { t: "  constructor(val) {", c: C.textSub },
            { t: "    this.val = val; this.next = null;", c: C.textSub },
            { t: "  }", c: C.textSub },
            { t: "}", c: C.green },
            { t: "class LinkedList { ... }", c: C.cyan },
          ]} />
          <Alert type="info" style={{ marginTop: 10 }}>O(1) insertion at head, but O(n) lookup.</Alert>
        </Block>
        <Block title="Algorithm: Two Pointers Pattern" color={C.orange}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Classic for array space optimization (e.g., Reverse Array).</div>
          <CodeBlock code={[
            { t: "function reverse(arr) {", c: C.orange },
            { t: "  let L = 0, R = arr.length - 1;", c: C.textSub },
            { t: "  while (L < R) {", c: C.textSub },
            { t: "    [arr[L], arr[R]] = [arr[R], arr[L]];", c: C.green },
            { t: "    L++; R--;", c: C.textSub },
            { t: "  }", c: C.textSub },
            { t: "}", c: C.orange },
          ]} />
        </Block>
        <Block title="Algorithm: Sliding Window" color={C.purple}>
          <div style={{ color: C.textSub, fontSize: 10, marginBottom: 8 }}>Used for finding subarrays with specific properties.</div>
          <CodeBlock code={[
            { t: "function maxSubSum(arr, k) {", c: C.purple },
            { t: "  let current = summer(arr.slice(0, k));", c: C.textSub },
            { t: "  // Slide the window...", c: C.textMuted },
            { t: "}", c: C.purple },
          ]} />
        </Block>
        <Block title="Built-in Complexity (Big O)" color={C.pink}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              { m: "push/pop", b: "O(1)" },
              { m: "shift/unshift", b: "O(n)" },
              { m: "splice", b: "O(n)" },
              { m: "sort", b: "O(n log n)" },
            ].map(x => (
              <div key={x.m} style={{ background: C.bgCode, padding: 8, borderRadius: 8 }}>
                <div style={{ color: C.pink, fontSize: 10, fontWeight: 700 }}>{x.m}</div>
                <div style={{ color: C.textSub, fontSize: 9 }}>{x.b}</div>
              </div>
            ))}
          </div>
        </Block>
      </Grid>
    </div>
  );
}
