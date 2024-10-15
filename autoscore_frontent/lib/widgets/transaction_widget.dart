import 'package:flutter/material.dart';

class TransactionWidget extends StatelessWidget {
  const TransactionWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Transactions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            ListTile(
              leading: Icon(Icons.credit_card, color: Colors.green),
              title: Text('Credit card'),
              subtitle: Text('Re-review'),
              trailing: Text('+\$220.00', style: TextStyle(color: Colors.green)),
            ),
            ListTile(
              leading: Icon(Icons.money, color: Colors.red),
              title: Text('Refund'),
              subtitle: Text('Transfer'),
              trailing: Text('-\$30.00', style: TextStyle(color: Colors.red)),
            ),
          ],
        ),
      ),
    );
  }
}