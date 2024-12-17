import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CodePlagiarism } from "@/app/score/plagiarism/api";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function PlagiarismComparison({ data }: { data: CodePlagiarism }) {
  const plagiarismPercentage = parseInt(data.plagiarismPercentage);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Plagiarism Comparison</span>
          <span className="text-sm font-normal">
            Student: {data.studentCodePlagiarism}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={plagiarismPercentage} className="w-full h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Plagiarism: {data.plagiarismPercentage || "N/A"}
          </p>
        </div>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={30}>
            <div>
              <h3 className="text-lg font-semibold mb-2">Self Code</h3>
              <pre
                className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <code>{data.selfCode || "No code available"}</code>
              </pre>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={30}>
            <div>
              <h3 className="text-lg font-semibold mb-2">Plagiarized Code</h3>
              <pre
                className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <code>
                  {data.studentPlagiarism || "No plagiarized code available"}
                </code>
              </pre>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
