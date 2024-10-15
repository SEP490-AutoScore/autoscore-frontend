import 'package:flutter/material.dart';

class Sidebar extends StatelessWidget {
  const Sidebar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      color: Colors.white,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Image.asset('assets/autoscore_logo.png', width: 40),
                const SizedBox(width: 8),
                const Text('AutoScore', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          _buildNavItem(Icons.dashboard, 'Dashboard', isSelected: true),
          _buildNavItem(Icons.person, 'Account'),
          _buildNavItem(Icons.assignment, 'Exams'),
          _buildNavItem(Icons.rate_review, 'Re-review'),
          _buildNavItem(Icons.payment, 'Payments'),
          const Spacer(),
          _buildNavItem(Icons.logout, 'Logout'),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String title, {bool isSelected = false}) {
    return Container(
      color: isSelected ? Colors.orange.withOpacity(0.1) : Colors.transparent,
      child: ListTile(
        leading: Icon(icon, color: isSelected ? Colors.orange : Colors.grey),
        title: Text(title, style: TextStyle(color: isSelected ? Colors.orange : Colors.black)),
        onTap: () {
          // Handle navigation
        },
      ),
    );
  }
}