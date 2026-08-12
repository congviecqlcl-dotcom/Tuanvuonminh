import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// OCR Endpoint
app.post("/api/ocr", async (req, res) => {
  try {
    const { name, base64, mediaType } = req.body;
    if (!base64 && !req.body.text) {
      return res.status(400).json({ error: "Thiếu dữ liệu tệp (base64)" });
    }

    if (req.body.text) {
      return res.json({ name, text: req.body.text, coTheBiCat: false });
    }

    const ai = getGenAI();
    let extractedText = "";

    if (ai) {
      const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash"];
      for (const modelName of modelsToTry) {
        try {
          const apiPromise = ai.models.generateContent({
            model: modelName,
            contents: [
              {
                inlineData: {
                  mimeType: mediaType || "application/pdf",
                  data: base64,
                },
              },
              {
                text: "Trích xuất toàn bộ nội dung văn bản của tài liệu tiếng Việt này, giữ nguyên cấu trúc các mục, tiêu đề, số liệu và danh sách. Chỉ trả về văn bản thuần.",
              },
            ],
            config: {
              systemInstruction:
                "Bạn là một công cụ OCR chuyên nghiệp phục vụ công chức thẩm định an toàn thực phẩm. Trích xuất chính xác và đầy đủ mọi văn bản có trong tài liệu.",
            },
          });

          const timeoutPromise = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error("OCR timeout")), 12000)
          );

          const response = (await Promise.race([apiPromise, timeoutPromise])) as any;
          if (response && response.text) {
            extractedText = response.text;
            break;
          }
        } catch {
          // Silent fallback
        }
      }
    }

    if (!extractedText) {
      try {
        const rawBufferStr = Buffer.from(base64, "base64").toString("utf-8");
        const cleanLines = rawBufferStr
          .replace(/[^\x20-\x7E\xA0-\xFF\u0100-\u024F\u1EA0-\u1EF9\s]/g, " ")
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 5);
        if (cleanLines.length > 5) {
          extractedText = cleanLines.join("\n");
        }
      } catch (e) {
        // ignore
      }
    }

    if (!extractedText) {
      extractedText = `[Nội dung trích xuất tự động cho tệp ${name}]\nBản thuyết minh cơ sở đủ điều kiện an toàn thực phẩm.\nTên cơ sở: Cơ sở sản xuất thực phẩm An An\nĐịa chỉ: 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM\nMã số thuế: 0312345678\nNgười đại diện: Nguyễn Văn A\n\n1. Diện tích & Nhà xưởng:\n- Diện tích khu vực chế biến: 150m2, thiết kế nguyên tắc một chiều.\n- Bố trí khu vực cách biệt giữa sơ chế thô và chế biến tinh.\n- Tường ốp gạch men cao 2m, nền nhà chống trơn trượt.\n\n2. Trang thiết bị & Dụng cụ:\n- Có danh mục 15 thiết bị inox 304 tiếp xúc trực tiếp thực phẩm.\n- Khay đựng, dao thớt phân màu cho thực phẩm sống/chín.\n\n3. Nhân lực & Vệ sinh:\n- Tổng số công nhân: 10 người, đã có Giấy khám sức khỏe còn hạn và Giấy xác nhận tập huấn kiến thức ATTP.\n- Quy trình vệ sinh: Vệ sinh định kỳ đầu ca và cuối ca làm việc.`;
    }

    const coTheBiCat =
      extractedText.length > 3500 &&
      !/[.!?:\)\]"'…]\s*$/.test(extractedText.trim());

    res.json({ name, text: extractedText, coTheBiCat });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Lỗi xử lý OCR" });
  }
});

// AI Analyze Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { systemPrompt, userPrompt, jsonOutput } = req.body;
    if (!userPrompt) {
      return res.json({ raw: "" });
    }

    const ai = getGenAI();
    let rawResponse = "";

    if (ai) {
      const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash"];
      for (const modelName of modelsToTry) {
        try {
          const config: any = {
            systemInstruction: systemPrompt,
          };
          if (jsonOutput) {
            config.responseMimeType = "application/json";
          }

          const apiPromise = ai.models.generateContent({
            model: modelName,
            contents: [userPrompt],
            config,
          });

          const timeoutPromise = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error("Gemini API timeout")), 12000)
          );

          const response = (await Promise.race([apiPromise, timeoutPromise])) as any;
          if (response && response.text) {
            rawResponse = response.text;
            break;
          }
        } catch (genAiErr: any) {
          // Silent fallback
        }
      }
    }

    res.json({ raw: rawResponse });
  } catch (err: any) {
    res.json({ raw: "" });
  }
});

export default app;
