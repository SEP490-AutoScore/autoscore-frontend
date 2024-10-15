import 'package:flutter/material.dart';

class StudentTable extends StatelessWidget {
  const StudentTable({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Top Best Students', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            DataTable(
              columns: [
                DataColumn(label: Text('Student')),
                DataColumn(label: Text('ID')),
                DataColumn(label: Text('Score')),
                DataColumn(label: Text('Subject')),
                DataColumn(label: Text('Semester')),
              ],
              rows: [
                DataRow(cells: [
                  DataCell(Text('Jane Smith')),
                  DataCell(Text('SE123456')),
                  DataCell(Text('9.8')),
                  DataCell(Text('PRN231')),
                  DataCell(Text('SU24')),
                ]),
                DataRow(cells: [
                  DataCell(Text('Clare')),
                  DataCell(Text('SE135789')),
                  DataCell(Text('9.4')),
                  DataCell(Text('PRN231')),
                  DataCell(Text('SU24')),
                ]),
                DataRow(cells: [
                  DataCell(Text('Leandro')),
                  DataCell(Text('SE197852')),
                  DataCell(Text('9.2')),
                  DataCell(Text('PRN231')),
                  DataCell(Text('SU24')),
                ]),
              ],
            ),
          ],
        ),
      ),
    );
  }
}