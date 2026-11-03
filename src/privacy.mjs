/**
 * Privacy Policy and Personal Information Collection Statement.
 * Supplied by the business (to be reviewed by its legal adviser); the wording is
 * reproduced as given. Each section is { h, blocks }, and each block is
 * { p } (paragraph), { ul } (bullet list) or { contact } (address block).
 * Rendered by legal('privacy') in src/pages.mjs.
 */

export const PRIVACY_TITLE = {
  en: 'Privacy Policy and Personal Information Collection Statement',
  zh: '私隱政策及收集個人資料聲明',
};

export const PRIVACY_INTRO = [
  {
    en: 'This website is operated by Vitas Limited, trading as VITAS 紓適寧 (“we”, “us” or “our”). We respect your privacy and handle personal data in accordance with the Personal Data (Privacy) Ordinance (Chapter 486 of the Laws of Hong Kong).',
    zh: '本網站由 Vitas Limited 以 VITAS 紓適寧品牌營運（下稱「我們」）。我們尊重您的私隱，並按照香港法例第486章《個人資料（私隱）條例》處理個人資料。',
  },
  {
    en: 'This statement explains how we collect, use, retain and protect personal data when you visit our website, contact us, subscribe to our communications or purchase our products.',
    zh: '本聲明說明當您瀏覽本網站、聯絡我們、訂閱我們的資訊或購買我們的產品時，我們如何收集、使用、保留及保障個人資料。',
  },
];

export const PRIVACY_SECTIONS = [
  {
    h: { en: '1. Personal data we collect', zh: '1. 我們收集的個人資料' },
    blocks: [
      { p: { en: 'Depending on how you interact with us, we may collect:', zh: '視乎您與我們互動的方式，我們可能收集：' } },
      {
        ul: [
          {
            en: 'Your name and contact details, including your email address, telephone number and delivery or billing address.',
            zh: '您的姓名及聯絡資料，包括電郵地址、電話號碼，以及送貨或帳單地址。',
          },
          {
            en: 'Information you provide in enquiries, messages, feedback or other correspondence.',
            zh: '您在查詢、訊息、意見或其他通訊中提供的資料。',
          },
          {
            en: 'Order and transaction information, including products purchased, delivery instructions and payment status, where applicable.',
            zh: '訂單及交易資料，包括所購產品、送貨指示及付款狀態（如適用）。',
          },
          {
            en: 'Your newsletter subscription preferences, marketing consent and unsubscribe requests.',
            zh: '您的電子通訊訂閱偏好、直接促銷同意及取消訂閱要求。',
          },
          {
            en: 'Technical information generated when you use our website, such as your IP address, browser type, access times and server logs, to the extent collected by our website or hosting providers.',
            zh: '您使用本網站時產生的技術資料，例如IP地址、瀏覽器類型、瀏覽時間及伺服器紀錄，具體視乎本網站或網站寄存服務供應商實際收集的資料而定。',
          },
        ],
      },
      {
        p: {
          en: 'Please do not submit medical records or other sensitive personal information that is unnecessary for your enquiry or purchase.',
          zh: '請勿提交與您的查詢或購物無關的醫療紀錄或其他敏感個人資料。',
        },
      },
      {
        p: {
          en: 'Providing personal data is voluntary. However, fields marked as required are necessary for the relevant service. If you do not provide the required information, we may be unable to respond to your enquiry, process your order or provide the service requested. Newsletter subscriptions and marketing consent are optional and are not a condition of purchase.',
          zh: '提供個人資料屬自願性質。然而，標示為必填的資料是提供相關服務所必需的。如您未能提供所需資料，我們可能無法回覆查詢、處理訂單或提供您要求的服務。訂閱電子通訊及同意接收直接促銷資訊均屬自願，並非購買產品的條件。',
        },
      },
    ],
  },
  {
    h: { en: '2. How we use personal data', zh: '2. 個人資料的使用目的' },
    blocks: [
      {
        p: {
          en: 'We use personal data only where necessary for the following purposes:',
          zh: '我們僅在有需要的情況下，為以下目的使用個人資料：',
        },
      },
      {
        ul: [
          { en: 'Responding to enquiries and providing customer support.', zh: '回覆查詢及提供客戶支援。' },
          {
            en: 'Processing and administering purchases, payments, deliveries, returns and refunds, where applicable.',
            zh: '處理及管理購物、付款、送貨、退貨及退款事宜（如適用）。',
          },
          { en: 'Managing the communications or subscriptions you request.', zh: '管理您要求接收的通訊或訂閱。' },
          {
            en: 'Operating, maintaining and securing our website and services, including investigating misuse and preventing fraud.',
            zh: '營運、維護及保障本網站和服務的安全，包括調查不當使用及防止欺詐。',
          },
          {
            en: 'Keeping necessary business records, complying with legal obligations and establishing, exercising or defending legal rights.',
            zh: '保存必要的業務紀錄、履行法律責任，以及確立、行使或維護法律權利。',
          },
          {
            en: 'Sending direct marketing communications where you have given the consent described below.',
            zh: '在取得您下述同意的情況下，發送直接促銷資訊。',
          },
        ],
      },
      {
        p: {
          en: 'We will not use your personal data for a new, unrelated purpose without your express and voluntary consent, unless otherwise permitted or required by law.',
          zh: '除非法律另有准許或規定，否則我們不會在未取得您明確及自願同意的情況下，將您的個人資料用於與原有收集目的無關的新目的。',
        },
      },
    ],
  },
  {
    h: { en: '3. Direct marketing', zh: '3. 直接促銷' },
    blocks: [
      {
        p: {
          en: 'With your consent, we may use your name and email address to send newsletters and promotional information about VITAS creams, gels and related cosmetic and body-care products, including product news and special offers.',
          zh: '在取得您的同意後，我們可能使用您的姓名及電郵地址，向您發送有關 VITAS 乳霜、凝膠及相關化妝品和身體護理產品的電子通訊及促銷資訊，包括產品消息及優惠。',
        },
      },
      {
        p: {
          en: 'We may not use your personal data for these direct marketing purposes unless we have received your consent. We will seek that consent separately when you subscribe or otherwise choose to receive marketing communications. Making an enquiry or purchase does not, by itself, constitute consent to marketing.',
          zh: '除非已取得您的同意，否則我們不可將您的個人資料用於上述直接促銷用途。我們會在您訂閱或選擇接收促銷資訊時，另行徵求您的同意。單純提出查詢或購買產品，並不構成同意接收直接促銷資訊。',
        },
      },
      {
        p: {
          en: 'You may withdraw your marketing consent at any time, free of charge, by using the unsubscribe link in our emails or contacting info@vitas.com.hk.',
          zh: '您可隨時透過電郵中的取消訂閱連結，或電郵至 info@vitas.com.hk，免費撤回接收直接促銷資訊的同意。',
        },
      },
      {
        p: {
          en: 'We do not sell personal data or provide it to third parties for their own direct marketing.',
          zh: '我們不會出售個人資料，亦不會向第三方提供個人資料供其自行作直接促銷用途。',
        },
      },
    ],
  },
  {
    h: { en: '4. Disclosure and service providers', zh: '4. 資料披露及服務供應商' },
    blocks: [
      {
        p: {
          en: 'Where necessary for the purposes above, we may disclose relevant personal data to:',
          zh: '在上述目的所需的範圍內，我們可能向以下類別的人士或機構披露相關個人資料：',
        },
      },
      {
        ul: [
          {
            en: 'Providers of website hosting, IT support, cloud storage, enquiry management and email delivery services.',
            zh: '提供網站寄存、資訊科技支援、雲端儲存、查詢管理及電郵發送服務的供應商。',
          },
          {
            en: 'Payment processors, banks, delivery companies and fulfilment providers involved in your transaction, where applicable.',
            zh: '參與處理您交易的付款服務供應商、銀行、送貨公司及訂單履行服務供應商（如適用）。',
          },
          {
            en: 'Professional advisers, including legal advisers, accountants and auditors.',
            zh: '專業顧問，包括法律顧問、會計師及核數師。',
          },
          {
            en: 'Courts, regulators, law-enforcement agencies or other persons where disclosure is required or permitted by law.',
            zh: '法院、監管機構、執法機關，或法律規定或准許向其披露資料的其他人士。',
          },
        ],
      },
      {
        p: {
          en: 'Some service providers may process or store personal data outside Hong Kong. Where we engage providers to process personal data on our behalf, we take reasonably practicable contractual or other measures to protect it against unauthorised or accidental access, processing, erasure, loss or use, and to prevent retention for longer than necessary.',
          zh: '部分服務供應商可能在香港境外處理或儲存個人資料。如我們委託服務供應商代為處理個人資料，我們會採取合理切實可行的合約或其他措施，防止資料在未獲准許或意外的情況下被查閱、處理、刪除、遺失或使用，並防止資料被保留超過所需時間。',
        },
      },
    ],
  },
  {
    h: { en: '5. Retention and security', zh: '5. 資料保留及保安' },
    blocks: [
      {
        p: {
          en: 'We retain personal data only for as long as necessary for the purposes for which it was collected, including applicable legal, accounting and record-keeping requirements and the handling of complaints or disputes. When it is no longer required, we take reasonably practicable steps to securely erase it or render it anonymous.',
          zh: '我們只會在達致收集目的所需的期間內保留個人資料，包括為符合適用的法律、會計及紀錄保存要求，以及處理投訴或爭議所需的期間。當資料不再需要時，我們會採取合理切實可行的步驟，以安全方式刪除資料或將其匿名化。',
        },
      },
      {
        p: {
          en: 'If you unsubscribe from marketing, we may retain a minimal record of your contact details and opt-out request solely to ensure that we respect your preference.',
          zh: '如您取消接收直接促銷資訊，我們可能保留最少量的聯絡資料及退出紀錄，僅用於確保遵從您的選擇。',
        },
      },
      {
        p: {
          en: 'We take reasonably practicable measures to protect personal data and restrict access to persons who need it for the relevant purposes. However, no internet transmission or electronic storage system can be guaranteed to be completely secure.',
          zh: '我們採取合理切實可行的措施保障個人資料，並只容許因相關用途而有需要的人士存取。然而，任何互聯網傳輸或電子儲存系統均無法保證絕對安全。',
        },
      },
    ],
  },
  {
    h: { en: '6. Cookies and third-party services', zh: '6. Cookies及第三方服務' },
    blocks: [
      {
        p: {
          en: 'We do not use analytics or advertising cookies or third-party tracking tools on this website. Our website and hosting services may nevertheless process technical information needed to operate and secure the site.',
          zh: '本網站不使用分析或廣告Cookies，亦不使用第三方追蹤工具。然而，本網站及網站寄存服務仍可能處理營運及保障網站安全所需的技術資料。',
        },
      },
      {
        p: {
          en: 'If you follow a link to an external website or use a third-party service, such as WhatsApp or an external payment service, that provider’s own privacy policy will also apply to its handling of your information.',
          zh: '如您透過連結前往外部網站，或使用WhatsApp、外部付款服務等第三方服務，該服務供應商處理您資料的方式亦受其自身的私隱政策規管。',
        },
      },
    ],
  },
  {
    h: { en: '7. Access, correction and privacy enquiries', zh: '7. 查閱、更正及私隱查詢' },
    blocks: [
      {
        p: {
          en: 'Under the Personal Data (Privacy) Ordinance, you may request access to personal data we hold about you and request correction of inaccurate personal data. You may also contact us to request deletion of personal data; we will consider such requests subject to applicable legal requirements and any continuing need to retain the data.',
          zh: '根據《個人資料（私隱）條例》，您可要求查閱我們持有的有關您的個人資料，並要求更正不準確的個人資料。您亦可聯絡我們要求刪除個人資料；我們會在考慮適用法律要求及是否仍有保留資料的需要後，處理有關要求。',
        },
      },
      { p: { en: 'Please send requests or privacy enquiries to:', zh: '如需提出要求或作出私隱查詢，請聯絡：' } },
      {
        contact: [
          { en: 'Privacy Officer', zh: '私隱主任' },
          { en: 'Vitas Limited - VITAS 紓適寧', zh: 'Vitas Limited - VITAS 紓適寧' },
          { en: 'Email: info@vitas.com.hk', zh: '電郵：info@vitas.com.hk' },
          {
            en: 'Address: Unit 411, Lippo Sun Plaza, 28 Canton Road, Tsim Sha Tsui, Kowloon, Hong Kong',
            zh: '地址：香港九龍尖沙咀廣東道28號力寶太陽廣場411室',
          },
        ],
      },
      {
        p: {
          en: 'We may ask for information reasonably necessary to verify your identity before handling a request. We will handle access and correction requests within the periods required by applicable law. Where permitted by law, we may charge a fee that is not excessive for complying with a data access request and will inform you beforehand.',
          zh: '在處理要求前，我們可能要求您提供合理所需的資料，以核實您的身分。我們會在適用法律規定的期限內處理查閱及更正資料要求。在法律准許的情況下，我們可能就查閱資料要求收取不超乎適度的費用，並會預先通知您。',
        },
      },
    ],
  },
  {
    h: { en: '8. Updates', zh: '8. 聲明更新' },
    blocks: [
      {
        p: {
          en: 'We may update this statement to reflect changes to our practices or applicable requirements. The current version will be published on this page. Where additional notice or consent is required by law, we will provide or obtain it as appropriate.',
          zh: '我們可能因應實際做法或適用要求的變更而更新本聲明。最新版本將刊載於本頁。如法律要求另行通知或取得同意，我們會按規定作出通知或取得同意。',
        },
      },
    ],
  },
];
