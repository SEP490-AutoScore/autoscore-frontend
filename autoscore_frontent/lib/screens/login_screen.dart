import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:autoscore_frontent/screens/homescreen.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // Ẩn debug banner
      home: Scaffold(
        backgroundColor: Color(0xFFF9E7E7), // Màu nền ngoài cùng
        body: Center(
          child: Container(
            height: 500, // Chiều cao của khung đăng nhập
            width: 700,  // Chiều rộng của khung đăng nhập
            child: Row(
              children: [
                // Nửa bên trái - Đăng nhập
                Expanded(
                  flex: 1,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    color: Colors.white,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Login with Google',
                          style: TextStyle(
                            fontSize: 30,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 50),
                        ElevatedButton.icon(
                          onPressed: () {
                            _handleSignIn(context); // Hàm xử lý đăng nhập Google
                          },
                          icon: Icon(Icons.login),
                          label: Text("Sign in with Google"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                            padding: const EdgeInsets.symmetric(
                                vertical: 15, horizontal: 100),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Nửa bên phải - Màu cam với lời chào
                Expanded(
                  flex: 1,
                  child: Container(
                    color: Colors.orange.shade400,
                    child: const Center(
                      child: Text(
                        'Hey\nWelcome Back',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  // Widget build(BuildContext context) {
  //   return const MaterialApp(
  //     home: Scaffold(
  //       body: Center(
  //         child: Text('Hello World!'),
  //       ),
  //     ),
  //   );
  // }
  }
  // Hàm xử lý đăng nhập với Google
  Future<void> _handleSignIn(BuildContext context) async {
  GoogleSignIn _googleSignIn;

  if (kIsWeb) {
    // Sử dụng client_id cho nền tảng web
    _googleSignIn = GoogleSignIn(
      clientId: '61066717237-3e2124jpnq6cc9p0atk409s9t6e90lmj.apps.googleusercontent.com',
      scopes: ['email'],
    );
  } else {
    // Sử dụng GoogleSignIn cho Android/iOS
    _googleSignIn = GoogleSignIn(
      scopes: ['email'],
    );
  }

  try {
    // Đăng nhập với Google
    GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

    if (googleUser != null) {
      // Lấy email từ tài khoản Google
        String email = googleUser.email;
       

      // Gọi API từ backend
      final response = await http.get(
        Uri.parse('http://localhost:8080/oauth2/authorization/google'),
        
      );

      if (response.statusCode == 200) {
        var data = json.decode(response.body);

        String token = data['token']; // Lấy token từ response
        String role = data['role'];   // Lấy role từ response

        // Chuyển đến trang HomeScreen và truyền role, token
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => HomeScreen(role: role, token: token),
          ),
        );
      } else {
        // Xử lý lỗi
        print('Failed to sign in: ${response.body}');
      }
    }
  } catch (error) {
    print('Sign in error: $error');
  }
}
}
