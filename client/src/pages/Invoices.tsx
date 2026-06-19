import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const MOCK_INVOICES = [
  {
    id: "INV-001",
    date: "2026-06-15",
    amount: 99,
    status: "paid",
    plan: "Professional",
    description: "الخطة الاحترافية - شهر واحد",
  },
  {
    id: "INV-002",
    date: "2026-05-15",
    amount: 99,
    status: "paid",
    plan: "Professional",
    description: "الخطة الاحترافية - شهر واحد",
  },
  {
    id: "INV-003",
    date: "2026-04-15",
    amount: 299,
    status: "paid",
    plan: "Enterprise",
    description: "الخطة المؤسسية - 3 أشهر",
  },
];

export default function Invoices() {
  const [isArabic, setIsArabic] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending">("all");

  const filteredInvoices = filterStatus === "all" 
    ? MOCK_INVOICES 
    : MOCK_INVOICES.filter(inv => inv.status === filterStatus);

  const handleDownload = (invoiceId: string) => {
    toast.success(isArabic ? "جاري تحميل الفاتورة..." : "Downloading invoice...");
  };

  const handleView = (invoiceId: string) => {
    toast.info(isArabic ? "فتح الفاتورة..." : "Opening invoice...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            {isArabic ? "الفواتير والمدفوعات" : "Invoices & Payments"}
          </h1>
          <p className="text-gray-400">
            {isArabic
              ? "عرض وإدارة جميع فواتيرك ومدفوعاتك"
              : "View and manage all your invoices and payments"}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex gap-4 flex-wrap"
        >
          <Button
            onClick={() => setFilterStatus("all")}
            variant={filterStatus === "all" ? "default" : "outline"}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            {isArabic ? "الكل" : "All"}
          </Button>
          <Button
            onClick={() => setFilterStatus("paid")}
            variant={filterStatus === "paid" ? "default" : "outline"}
            className="gap-2"
          >
            {isArabic ? "مدفوعة" : "Paid"}
          </Button>
          <Button
            onClick={() => setFilterStatus("pending")}
            variant={filterStatus === "pending" ? "default" : "outline"}
            className="gap-2"
          >
            {isArabic ? "قيد الانتظار" : "Pending"}
          </Button>
        </motion.div>

        {/* Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice, idx) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-gray-900/50 border border-gray-800/50 p-6 hover:border-cyan-500/30 transition-all">
                  <div className="grid md:grid-cols-6 gap-4 items-center">
                    {/* Invoice ID */}
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        {isArabic ? "رقم الفاتورة" : "Invoice ID"}
                      </p>
                      <p className="font-semibold text-white">{invoice.id}</p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        {isArabic ? "التاريخ" : "Date"}
                      </p>
                      <p className="text-white">{invoice.date}</p>
                    </div>

                    {/* Plan */}
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        {isArabic ? "الخطة" : "Plan"}
                      </p>
                      <p className="text-white">{invoice.plan}</p>
                    </div>

                    {/* Amount */}
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        {isArabic ? "المبلغ" : "Amount"}
                      </p>
                      <p className="text-lg font-semibold text-cyan-400">
                        ${invoice.amount}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        {isArabic ? "الحالة" : "Status"}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          invoice.status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {invoice.status === "paid"
                          ? isArabic
                            ? "مدفوعة"
                            : "Paid"
                          : isArabic
                          ? "قيد الانتظار"
                          : "Pending"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(invoice.id)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(invoice.id)}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="bg-gray-900/50 border border-gray-800/50 p-12 text-center">
              <p className="text-gray-400">
                {isArabic ? "لا توجد فواتير" : "No invoices found"}
              </p>
            </Card>
          )}
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-cyan-900/20 border border-cyan-500/30 p-6">
            <p className="text-sm text-gray-400 mb-2">
              {isArabic ? "إجمالي المدفوع" : "Total Paid"}
            </p>
            <p className="text-3xl font-bold text-cyan-400">
              ${filteredInvoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)}
            </p>
          </Card>

          <Card className="bg-pink-900/20 border border-pink-500/30 p-6">
            <p className="text-sm text-gray-400 mb-2">
              {isArabic ? "قيد الانتظار" : "Pending"}
            </p>
            <p className="text-3xl font-bold text-pink-400">
              ${filteredInvoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)}
            </p>
          </Card>

          <Card className="bg-purple-900/20 border border-purple-500/30 p-6">
            <p className="text-sm text-gray-400 mb-2">
              {isArabic ? "عدد الفواتير" : "Total Invoices"}
            </p>
            <p className="text-3xl font-bold text-purple-400">
              {filteredInvoices.length}
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
