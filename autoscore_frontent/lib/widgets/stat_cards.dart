import 'package:flutter/material.dart';

class StatCards extends StatelessWidget {
  const StatCards({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _buildStatCard('Exams', '8', '95%', Colors.green),
        _buildStatCard('Today Users', '2000', '8%', Colors.blue),
        _buildStatCard('Re-reviews', '1k', '2%', Colors.orange),
        _buildStatCard('Transactions', '1000', '10%', Colors.red),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, String percentage, Color color) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              Text(percentage, style: TextStyle(color: color)),
            ],
          ),
        ),
      ),
    );
  }
}