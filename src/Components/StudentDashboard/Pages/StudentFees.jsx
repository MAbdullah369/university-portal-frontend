import React, { useState, useEffect } from 'react';
import { CreditCard, Download, CheckCircle, Clock, Receipt, AlertCircle } from 'lucide-react';

const StudentFees = () => {
  const [student, setStudent] = useState(null);
  const [feeStatus, setFeeStatus] = useState('Paid'); // Mock status

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setStudent(user);
  }, []);

  const feeDetails = [
    { label: 'Tuition Fee', amount: 'Rs. 120,000' },
    { label: 'Registration Fee', amount: 'Rs. 10,000' },
    { label: 'Library Fee', amount: 'Rs. 2,000' },
    { label: 'Sports & Extra-curricular', amount: 'Rs. 3,000' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Fee Details</h1>
        <p className="text-slate-500 mt-1">Manage your semester payments and download fee vouchers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fee Status Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Receipt size={20} className="text-emerald-500" />
                Current Semester Fee (Fall 2026)
              </h3>
              <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {feeStatus === 'Paid' ? 'PAID' : 'PENDING'}
              </span>
            </div>
            <div className="p-6 space-y-4">
              {feeDetails.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-semibold text-slate-800">{item.amount}</span>
                </div>
              ))}
              <div className="pt-4 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-800">Total Amount</span>
                <span className="text-2xl font-bold text-emerald-600">Rs. 135,000</span>
              </div>
            </div>
            {feeStatus !== 'Paid' && (
              <div className="p-4 bg-red-50 border-t border-red-100 flex items-center gap-3 text-red-700 text-sm">
                <AlertCircle size={18} />
                Please clear your dues by Oct 30, 2026 to avoid a late fine.
              </div>
            )}
          </div>

          <div className="bg-emerald-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Instant Online Payment</h3>
              <p className="text-emerald-100 text-sm mb-6 max-w-md">
                Pay your fees securely using Credit/Debit Card or Mobile Banking. Get instant confirmation and digital receipts.
              </p>
              <button className="bg-white text-emerald-900 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition shadow-lg">
                Pay Now
              </button>
            </div>
            <CreditCard className="absolute -right-8 -bottom-8 text-white/10 w-48 h-48 rotate-12" />
          </div>
        </div>

        {/* History / Downloads */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Download size={20} className="text-emerald-500" />
              Download Vouchers
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">Fee Voucher</p>
                    <p className="text-xs text-slate-400 font-medium">Fall 2026 - Main Campus</p>
                  </div>
                  <Download size={18} className="text-slate-400 group-hover:text-emerald-500" />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer group opacity-60">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-700">Fee Receipt</p>
                    <p className="text-xs text-slate-400 font-medium">Spring 2026 - Paid</p>
                  </div>
                  <CheckCircle size={18} className="text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-emerald-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Fee Status Updated</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Today, 09:45 AM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Voucher Generated</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Oct 12, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFees;
