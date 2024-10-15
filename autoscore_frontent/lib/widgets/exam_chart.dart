import 'package:flutter/material.dart';

class ExamChart extends StatelessWidget {
  const ExamChart({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Total Exam Graded', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            Container(
              height: 200,
              child: Center(child: Text('Exam Chart Placeholder')),
            ),
          ],
        ),
      ),
    );
  }
}