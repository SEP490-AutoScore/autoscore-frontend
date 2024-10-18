import 'package:flutter/material.dart';

class DynamicSidebar extends StatefulWidget {
  @override
  _DynamicSidebarState createState() => _DynamicSidebarState();
}

class _DynamicSidebarState extends State<DynamicSidebar> {
  Map<String, bool> _openMenus = {};

  void _toggleMenu(String menu) {
    setState(() {
      _openMenus[menu] = !(_openMenus[menu] ?? false);
    });
  }

  Widget _buildMenuItem(IconData icon, String label, List<String>? children) {
    bool isOpen = _openMenus[label] ?? false;
    return Column(
      children: [
        ListTile(
          leading: Icon(icon),
          title: Text(label),
          trailing: children != null
              ? Icon(isOpen ? Icons.expand_less : Icons.expand_more)
              : null,
          onTap: () {
            if (children != null) {
              _toggleMenu(label);
            }
          },
          tileColor: isOpen ? Colors.orange[100] : null,
          textColor: isOpen ? Colors.orange[700] : null,
        ),
        if (isOpen && children != null)
          Column(
            children: children
                .map((child) => ListTile(
                      title: Text(child),
                      contentPadding: EdgeInsets.only(left: 32.0),
                      onTap: () {
                        // Handle submenu item tap
                      },
                    ))
                .toList(),
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
  decoration: BoxDecoration(
    color: Colors.white,
    boxShadow: [
      BoxShadow(
        color: Colors.grey.withOpacity(0.5),
        spreadRadius: 1,
        blurRadius: 7,
        offset: Offset(0, 3),
      ),
    ],
  ),
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Row(
        children: [
          Image.asset(
            'assets/autoscore_logo.png', // Thay thế bằng đường dẫn thực tế đến logo của bạn
            width: 40,
            height: 40,
          ),
          SizedBox(width: 10),
          Text(
            'AutoScore',
            style: TextStyle(
              color: Colors.black,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
      SizedBox(height: 10),
      Text(
        'Welcome back!',
        style: TextStyle(
          color: Colors.grey[600],
          fontSize: 14,
        ),
      ),
    ],
  ),
),
          _buildMenuItem(Icons.dashboard, 'Dashboard', null),
          _buildMenuItem(Icons.person, 'Accounts', [
            'Permissions',
            'All Permissions',
            'Users',
            'All Users',
            'Add User',
            'Setting'
          ]),
          _buildMenuItem(Icons.assignment, 'Exams', [
            'All Exams',
            'Add Exam',
            'Exam Results'
          ]),
          _buildMenuItem(Icons.refresh, 'Re-review', [
            'Requests',
            'History',
            'Students',
            'Lectures'
          ]),
          // _buildMenuItem(Icons.payment, 'Payments', [
          //   'Transactions',
          //   'Refunded'
          // ]),
          Divider(),
          ListTile(
            leading: Icon(Icons.exit_to_app),
            title: Text('Logout'),
            onTap: () {
              // Handle logout
            },
          ),
        ],
      ),
    );
  }
}