import { useState } from "react";
import {
  Page,
  Card,
  TextField,
  Button,
  Text,
  BlockStack,
  Box,
} from "@shopify/polaris";

export default function Index() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askClaude() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  }

  return (
    <Page title="🤖 Claude AI — JPC Equestrian Inc">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="300">
            <Text variant="headingMd">
              Store ke baare mein kuch bhi poochho
            </Text>
            <TextField
              label="Apna sawaal likho"
              value={question}
              onChange={setQuestion}
              placeholder="Jaise: Kitne orders pending hain? Kaunsa product hai?"
              multiline={3}
              autoComplete="off"
            />
            <Button
              variant="primary"
              onClick={askClaude}
              loading={loading}
            >
              Claude se Poochho
            </Button>
          </BlockStack>
        </Card>

        {answer && (
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd">🤖 Claude ka Jawab:</Text>
              <Box padding="300" background="bg-surface-secondary">
                <Text>{answer}</Text>
              </Box>
            </BlockStack>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}