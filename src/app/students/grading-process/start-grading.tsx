"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL } from "@/config/apiConfig";

interface SelectedStudentDialogProps {
    open: boolean;
    onClose: () => void;
    studentIds: number[];
    examPaperId: number;
    organizationId: number | 0;
}

export function StartGrading({
    open,
    onClose,
    studentIds,
    examPaperId,
    organizationId,
}: SelectedStudentDialogProps) {
    const [numberDeploy, setNumberDeploy] = useState(1);
    const showToast = useToastNotification();
    const [examType, setExamType] = useState<"ASSIGNMENT" | "EXAM">("EXAM");
    const [memoryMegabyte, setMemoryMegabyte] = useState(0);
    const [processors, setProcessors] = useState(0);

    const handleSubmit = async () => {
        const requestBody = {
            listStudent: studentIds,
            examPaperId : examPaperId,
            examType,
            organizationId,
            numberDeploy,
            memory_Megabyte: memoryMegabyte,
            processors,
        };

        try {
            const response = await fetch(`${BASE_URL}/api/grading`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                showToast({
                    title: "Starting success",
                    description: "Grading start",
                    actionText: "OK",
                    variant: "default",
                });
                onClose();
            } else {
                showToast({
                    title: "Bad Request.",
                    description: "There was a problem with your request.",
                    variant: "destructive",
                  });
            }
        } catch (error) {
            showToast({
                title: "Bad Request.",
                description: "There was a problem with your request.",
                variant: "destructive",
              });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start grading</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Selected students: <span className="font-semibold">{studentIds.length}</span>
                    </p>
                    {studentIds.length > 0 && (
                        <ul className="list-disc pl-5 text-sm text-muted-foreground max-h-32 overflow-y-auto">
                            {studentIds.map((id) => (
                                <li key={id} className="capitalize">
                                    {id}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Number Deploy</label>
                        <Input
                            type="number"
                            value={numberDeploy}
                            min={1}
                            onChange={(e) => setNumberDeploy(Math.max(1, Number(e.target.value)))}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Exam Type</label>
                        <Select onValueChange={(value) => setExamType(value as "ASSIGNMENT" | "EXAM")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select exam type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                                <SelectItem value="EXAM">Exam</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Memory (MB)</label>
                        <Input
                            type="number"
                            value={memoryMegabyte}
                            onChange={(e) => setMemoryMegabyte(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Processors</label>
                        <Input
                            type="number"
                            value={processors}
                            onChange={(e) => setProcessors(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <Button
                        onClick={onClose}
                        className="bg-white text-black hover:bg-orange-500 hover:text-white border border-gray-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-orange-500 text-white hover:bg-orange-600"
                    >
                        Start Grading
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
