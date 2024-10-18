import 'package:flutter/material.dart';
import '../widgets/dynamic_sidebar.dart';
import '../widgets/top_bar.dart';
import '../widgets/stat_cards.dart';
import '../widgets/exam_chart.dart';
import '../widgets/score_chart.dart';
import '../widgets/student_table.dart';
import '../widgets/transaction_widget.dart';
import '../widgets/grading_widget.dart';
import '../widgets/score_distribution_widget.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          DynamicSidebar(),
          Expanded(
            child: Column(
              children: [
                const TopBar(),
                Expanded(
                  child: SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const StatCards(),
                          const SizedBox(height: 20),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                flex: 2,
                                child: Column(
                                  children: const [
                                    ExamChart(),
                                    SizedBox(height: 20),
                                    ScoreChart(),
                                    SizedBox(height: 20),
                                    StudentTable(),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 20),
                              Expanded(
                                child: Column(
                                  children: const [
                                    // TransactionWidget(),
                                    SizedBox(height: 20),
                                    GradingWidget(),
                                    SizedBox(height: 20),
                                    ScoreDistributionWidget(),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}