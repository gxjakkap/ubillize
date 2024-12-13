export const CURRENCY_SYMBOL = '฿'

export enum AppRoles {
    Tenant = 'tenant',
    Staff = 'staff',
    Admin = 'admin'
}

export const TenantAppRoles = [AppRoles.Tenant]
export const StaffAppRoles = [AppRoles.Staff, AppRoles.Admin]
export const AdminAppRoles = [AppRoles.Admin]

export const SLIP_MAX_FILE_SIZE = 10 * 1024 * 1024

export const BankDict: { [key: string]: string } = {
    "002": "Bangkok Bank Public Company Limited (BBL)",
    "004": "Kasikornbank Public Company Limited (KBANK)",
    "006": "Krung Thai Bank Public Company Limited (KTB)",
    "008": "JPMorgan Chase Bank, Bangkok Branch (JPMC)",
    "009": "Oversea-Chinese Banking Corporation Ltd. (OCBC)",
    "010": "The Bank of Tokyo-Mitsubishi UFJ, Ltd",
    "011": "TMB Bank Public Company Limited (TTB)",
    "014": "Siam Commercial Bank Public Company Limited (SCB)",
    "017": "Citibank N.A. (CITI)",
    "018": "Sumitomo Mitsui Banking Corporation (SMBC)",
    "020": "Standard Chartered Bank (Thai) Public Company Limited (SCBT)",
    "022": "CIMB Thai Bank Public Company Limited (CIMB)",
    "023": "RHB Bank Berhad (RHB)",
    "024": "United Overseas Bank (Thai) PCL (UOBT)",
    "025": "Bank of Ayudhya Public Company Limited (BAY)",
    "026": "Mega International Commercial Bank Public Company Limited (MEGA ICBC)",
    "027": "Bank of America National Association (AMERICA)",
    "028": "Calyon",
    "029": "Indian Overseas Bank, Bangkok Branch (I.O.B.)",
    "030": "Government Saving Bank (GOV)",
    "031": "Hong Kong & Shanghai Corporation Limited (HSBC)",
    "032": "Deutsche Bank Aktiengesellschaft (DB)",
    "033": "Government Housing Bank (GHB)",
    "034": "Bank for Agriculture and Agricultural Cooperatives (AGRI)",
    "035": "Export-Import Bank of Thailand (EXIM)",
    "039": "Mizuho Corporate Bank Limited (MHCB)",
    "045": "BNPN Paribas, Bangkok (BNPP)",
    "052": "Bank of China Limited, Bangkok Branch (BOC)",
    "065": "Thanachart Bank Public Company",
    "066": "Islamic Bank of Thailand (ISBT)",
    "067": "Tisco Bank Public Company Limited (TISCO)",
    "069": "Kiatnakin Bank Public Company Limited (KK)",
    "070": "Industrial and Commercial Bank of China (THAI) Public Company Limited (ICBC)",
    "071": "The Thai Credit Retail Bank Public Company Limited (TCRB)",
    "073": "Land and Houses Bank Public Company Limited (LHBANK)",
    "079": "ANZ Bank (Thai) Public Company Limited (ANZ)",
    "080": "Sumitomo Mitsui Trust Bank (THAI) PCL. (SMTB)",
    "098": "Small and Medium Enterprise Development Bank of Thailand (SMEB)"
}

export const BankShortDict: { [key: string]: string } = {
    "002": "BBL",
    "004": "KBANK",
    "006": "KTB",
    "008": "JPMC",
    "009": "OCBC",
    "010": "BTMU",
    "011": "TTB",
    "014": "SCB",
    "017": "CITI",
    "018": "SMBC",
    "020": "SCBT",
    "022": "CIMB",
    "023": "RHB",
    "024": "UOBT",
    "025": "BAY",
    "026": "MEGA ICBC",
    "027": "AMERICA",
    "028": "Calyon",
    "029": "IOB",
    "030": "GOV",
    "031": "HSBC",
    "032": "DB",
    "033": "GHB",
    "034": "AGRI",
    "035": "EXIM",
    "039": "MHCB",
    "045": "BNPP",
    "052": "BOC",
    "065": "Thanachart",
    "066": "ISBT",
    "067": "TISCO",
    "069": "KK",
    "070": "ICBC",
    "071": "TCRB",
    "073": "LHBANK",
    "079": "ANZ",
    "080": "SMTB",
    "098": "SMEB"
}
// data from omise/bank-logo
/**
 Copyright (c) 2015 Omise

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

export const FullBankData = [
    { "short": "bbl", "code": "002", "color": "#1e4598", "official_name": "BANGKOK BANK PUBLIC COMPANY LTD.", "nice_name": "Bangkok Bank", "swift_code": "BKKBTHBK" },
    { "short": "kbank", "code": "004", "color": "#138f2d", "official_name": "KASIKORNBANK PUBLIC COMPANY LTD.", "nice_name": "Kasikorn Bank", "swift_code": "KASITHBK" },
    { "short": "rbs", "code": "005", "color": "#032952", "official_name": "THE ROYAL BANK OF SCOTLAND PLC", "nice_name": "Royal Bank of Scotland", "swift_code": "RBOSGB2L" },
    { "short": "ktb", "code": "006", "color": "#1ba5e1", "official_name": "KRUNG THAI BANK PUBLIC COMPANY LTD.", "nice_name": "Krungthai Bank", "swift_code": "KRTHTHBK" },
    { "short": "jpm", "code": "008", "color": "#321c10", "official_name": "JPMORGAN CHASE BANK, NATIONAL ASSOCIATION", "nice_name": "J.P. Morgan", "swift_code": "CHASTHBXSEC" },
    { "short": "mufg", "code": "010", "color": "#d61323", "official_name": "THE BANK OF TOKYO-MITSUBISHI UFJ, LTD.", "nice_name": "Bank of Tokyo-Mitsubishi UFJ", "swift_code": "BOTKTHBX" },
    { "short": "tmb", "code": "011", "color": "#1279be", "official_name": "TMB BANK PUBLIC COMPANY LIMITED.", "nice_name": "TMB Bank", "swift_code": "TMBKTHBK" },
    { "short": "scb", "code": "014", "color": "#4e2e7f", "official_name": "SIAM COMMERCIAL BANK PUBLIC COMPANY LTD.", "nice_name": "Siam Commercial Bank", "swift_code": "SICOTHBK" },
    { "short": "citi", "code": "017", "color": "#1583c7", "official_name": "CITIBANK, N.A.", "nice_name": "Citibank", "swift_code": "CITITHBX" },
    { "short": "smbc", "code": "018", "color": "#a0d235", "official_name": "SUMITOMO MITSUI BANKING CORPORATION", "nice_name": "Sumitomo Mitsui Banking Corporation", "swift_code": "SMBCTHBK" },
    { "short": "sc", "code": "020", "color": "#0f6ea1", "official_name": "STANDARD CHARTERED BANK (THAI) PUBLIC COMPANY LIMITED", "nice_name": "Standard Chartered (Thai)", "swift_code": "SCBLTHBX" },
    { "short": "cimb", "code": "022", "color": "#7e2f36", "official_name": "CIMB THAI BANK PUPBLIC COMPANY LTD.", "nice_name": "CIMB Thai Bank", "swift_code": "UBOBTHBK" },
    { "short": "uob", "code": "024", "color": "#0b3979", "official_name": "UNITED OVERSEAS BANK (THAI) PUBLIC COMPANY LIMITED", "nice_name": "United Overseas Bank (Thai)", "swift_code": "UOVBTHBK" },
    { "short": "bay", "code": "025", "color": "#fec43b", "official_name": "BANK OF AYUDHYA PUBLIC COMPANY LTD.", "nice_name": "Bank of Ayudhya (Krungsri)", "swift_code": "AYUDTHBK" },
    { "short": "mega", "code": "026", "color": "#815e3b", "official_name": "MEGA INTERNATIONAL COMMERCIAL BANK PUBLIC COMPANY LIMITED", "nice_name": "Mega International Commercial Bank", "swift_code": "ICBCTHBKBNA" },
    { "short": "boa", "code": "027", "color": "#e11e3c", "official_name": "BANK OF AMERICA, NATIONAL ASSOCIATION", "nice_name": "Bank of America", "swift_code": "BOFATH2X" },
    { "short": "cacib", "code": "028", "color": "#0e765b", "official_name": "CREDIT AGRICOLE CORPORATE AND INVESTMENT BANK", "nice_name": "Crédit Agricole", "swift_code": "AGRITHB1" },
    { "short": "gsb", "code": "030", "color": "#eb198d", "official_name": "THE GOVERNMENT SAVINGS BANK", "nice_name": "Government Savings Bank", "swift_code": "GSBATHBK" },
    { "short": "hsbc", "code": "031", "color": "#fd0d1b", "official_name": "THE HONGKONG AND SHANGHAI BANKING CORPORATION LTD.", "nice_name": "Hongkong and Shanghai Banking Corporation", "swift_code": "HSBCTHBK" },
    { "short": "db", "code": "032", "color": "#0522a5", "official_name": "DEUTSCHE BANK AG.", "nice_name": "Deutsche Bank", "swift_code": "DEUTTHBK" },
    { "short": "ghb", "code": "033", "color": "#f57d23", "official_name": "THE GOVERNMENT HOUSING BANK", "nice_name": "Government Housing Bank", "swift_code": "GOHUTHB1" },
    { "short": "baac", "code": "034", "color": "#4b9b1d", "official_name": "BANK FOR AGRICULTURE AND AGRICULTURAL COOPERATIVES", "nice_name": "Bank for Agriculture and Agricultural Cooperatives", "swift_code": "BAABTHBK" },
    { "short": "mb", "code": "039", "color": "#150b78", "official_name": "MIZUHO BANK, LTD.", "nice_name": "Mizuho Bank", "swift_code": "MHCBTHBK" },
    { "short": "tbank", "code": "065", "color": "#fc4f1f", "official_name": "THANACHART BANK PUBLIC COMPANY LTD.", "nice_name": "Thanachart Bank", "swift_code": "THBKTHBK" },
    { "short": "bnp", "code": "045", "color": "#14925e", "official_name": "BNP PARIBAS", "nice_name": "BNP Paribas", "swift_code": "BNPATHBK" },
    { "short": "ibank", "code": "066", "color": "#184615", "official_name": "ISLAMIC BANK OF THAILAND", "nice_name": "Islamic Bank of Thailand", "swift_code": "TIBTTHBK" },
    { "short": "tisco", "code": "067", "color": "#12549f", "official_name": "TISCO BANK PUBLIC COMPANY LIMITED", "nice_name": "Tisco Bank", "swift_code": "TFPCTHB1" },
    { "short": "kk", "code": "069", "color": "#199cc5", "official_name": "KIATNAKIN BANK PUBLIC COMPANY LIMITED", "nice_name": "Kiatnakin Bank", "swift_code": "KKPBTHBK" },
    { "short": "icbc", "code": "070", "color": "#c50f1c", "official_name": "INDUSTRIAL AND COMMERCIAL BANK OF CHINA (THAI) PUBLIC COMPANY LIMITED", "nice_name": "Industrial and Commercial Bank of China (Thai)", "swift_code": "ICBKTHBK" },
    { "short": "tcrb", "code": "071", "color": "#0a4ab3", "official_name": "THE THAI CREDIT RETAIL BANK PUBLIC COMPANY LIMITED", "nice_name": "Thai Credit Retail Bank", "swift_code": "THCETHB1" },
    { "short": "lhb", "code": "073", "color": "#6d6e71", "official_name": "LAND AND HOUSES BANK PUBLIC COMPANY LIMITED", "nice_name": "Land and Houses Bank", "swift_code": "LAHRTHB2" },
    { "short": "ttb", "code": "076", "color": "#ecf0f1", "official_name": "TMBTHANACHART BANK PUBLIC COMPANY LIMITED", "nice_name": "TMBThanachart Bank", "swift_code": "TMBKTHBK" }
]

export const BankOptions = [
    { "short": "bbl", "code": "002", "color": "#1e4598", "official_name": "BANGKOK BANK PUBLIC COMPANY LTD.", "nice_name": "Bangkok Bank", "swift_code": "BKKBTHBK" },
    { "short": "kbank", "code": "004", "color": "#138f2d", "official_name": "KASIKORNBANK PUBLIC COMPANY LTD.", "nice_name": "Kasikorn Bank", "swift_code": "KASITHBK" },
    { "short": "ktb", "code": "006", "color": "#1ba5e1", "official_name": "KRUNG THAI BANK PUBLIC COMPANY LTD.", "nice_name": "Krungthai Bank", "swift_code": "KRTHTHBK" },
    { "short": "scb", "code": "014", "color": "#4e2e7f", "official_name": "SIAM COMMERCIAL BANK PUBLIC COMPANY LTD.", "nice_name": "Siam Commercial Bank", "swift_code": "SICOTHBK" },
    { "short": "citi", "code": "017", "color": "#1583c7", "official_name": "CITIBANK, N.A.", "nice_name": "Citibank", "swift_code": "CITITHBX" },
    { "short": "cimb", "code": "022", "color": "#7e2f36", "official_name": "CIMB THAI BANK PUPBLIC COMPANY LTD.", "nice_name": "CIMB Thai Bank", "swift_code": "UBOBTHBK" },
    { "short": "bay", "code": "025", "color": "#fec43b", "official_name": "BANK OF AYUDHYA PUBLIC COMPANY LTD.", "nice_name": "Bank of Ayudhya (Krungsri)", "swift_code": "AYUDTHBK" },
    { "short": "gsb", "code": "030", "color": "#eb198d", "official_name": "THE GOVERNMENT SAVINGS BANK", "nice_name": "Government Savings Bank", "swift_code": "GSBATHBK" },
    { "short": "ghb", "code": "033", "color": "#f57d23", "official_name": "THE GOVERNMENT HOUSING BANK", "nice_name": "Government Housing Bank", "swift_code": "GOHUTHB1" },
    { "short": "baac", "code": "034", "color": "#4b9b1d", "official_name": "BANK FOR AGRICULTURE AND AGRICULTURAL COOPERATIVES", "nice_name": "Bank for Agriculture and Agricultural Cooperatives", "swift_code": "BAABTHBK" },
    { "short": "ibank", "code": "066", "color": "#184615", "official_name": "ISLAMIC BANK OF THAILAND", "nice_name": "Islamic Bank of Thailand", "swift_code": "TIBTTHBK" },
    { "short": "tisco", "code": "067", "color": "#12549f", "official_name": "TISCO BANK PUBLIC COMPANY LIMITED", "nice_name": "Tisco Bank", "swift_code": "TFPCTHB1" },
    { "short": "kk", "code": "069", "color": "#199cc5", "official_name": "KIATNAKIN BANK PUBLIC COMPANY LIMITED", "nice_name": "Kiatnakin Bank", "swift_code": "KKPBTHBK" },
    { "short": "lhb", "code": "073", "color": "#6d6e71", "official_name": "LAND AND HOUSES BANK PUBLIC COMPANY LIMITED", "nice_name": "Land and Houses Bank", "swift_code": "LAHRTHB2" },
    { "short": "ttb", "code": "076", "color": "#ecf0f1", "official_name": "TMBTHANACHART BANK PUBLIC COMPANY LIMITED", "nice_name": "TMBThanachart Bank", "swift_code": "TMBKTHBK" }
]
  