# AI DataVault: Trusted Data Marketplace for AI Training

[![Hackathon: cheqd AI TruthRise](https://img.shields.io/badge/Hackathon-cheqd%20AI%20TruthRise-blue)](https://dorahacks.io/hackathon/cheqd-verifiable-ai)
[![Status: In Development](https://img.shields.io/badge/Status-In%20Development-yellow)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A decentralized marketplace where AI developers can discover, verify, and access ethical datasets with proven provenance, clear consent mechanisms, and quality guarantees.

## 🌟 The Problem

AI systems are only as good as the data they're trained on. Today's AI landscape faces critical challenges:

- **Trust Deficit**: No standardized way to verify dataset origins, collection methods, or consent status
- **Quality Uncertainty**: Difficult to assess dataset quality, representativeness, or bias before using it
- **Ethics Concerns**: Lack of transparency about how data was collected and whether proper consent was obtained
- **Provenance Tracking**: No reliable way to track the lineage and modifications of datasets over time

## 💡 Our Solution

AI DataVault creates a trusted marketplace for AI training data by leveraging cheqd's verifiable credentials infrastructure:

- **Verified Data Sources**: Every dataset provider has a DID (Decentralized Identifier) with verifiable credentials
- **Dataset DIDs**: Each dataset gets its own DID with linked metadata through DID-Linked Resources
- **Trust Registry**: A blockchain-based registry of trusted data providers and dataset quality assessments
- **Transparent Metrics**: Clear indicators for dataset quality, bias assessment, and ethical collection practices
- **Economic Incentives**: Token-based reward system for high-quality, ethical data provision

## 🔑 Key Features

### For Data Providers
- Create provider identity with verifiable credentials
- Upload and describe datasets with standardized metadata
- Set usage policies and licensing terms with cryptographic enforcement
- Earn rewards for high-quality, well-documented data

### For AI Developers
- Discover verified datasets with quality guarantees
- Assess dataset characteristics before purchase
- Access clear provenance and lineage information
- Receive verifiable proofs of dataset authenticity and consent

### Core Technology Components
- **DIDs & Verifiable Credentials**: For identity and attribute verification
- **DID-Linked Resources**: For dataset metadata and schema storage
- **Trust Registry**: For provider and dataset verification
- **Payment-Gated Access**: For monetization and incentive alignment

## 🛠️ Technology Stack

- **Frontend**: React.js with Next.js, TailwindCSS
- **Backend**: Node.js, Express
- **Blockchain**: cheqd network for DIDs and verifiable credentials
- **Storage**: IPFS for dataset storage, PostgreSQL for relational data
- **Authentication**: DID-based authentication
- **Verification**: cheqd SDKs for credential verification

## 🏗️ System Architecture

This section outlines the local development architecture and the CI/CD pipeline.

```mermaid
graph TD
    subgraph "User's Local Machine"
        U[Developer] -->|1. Runs 'docker compose up'| CLI(Docker Compose CLI)
        CLI -->|2. Reads| DComposeFile(docker-compose.yml)
        Browser(User's Browser/API Tool) -->|7. HTTP Request to localhost:3001| HostPort(Host Port 3001)
    end

    subgraph "Docker Environment (Managed by Docker Engine)"
        direction LR
        HostPort -->|8. Forwards to| AppContainerPort(app:3001)

        subgraph "Docker Network (e.g., aidatavault_default)"
            direction LR
            AppContainer[("
                **app Container (aidatavault-app-1)**
                Node.js Server
                <em>Listens on 3001</em>
                Env: DATABASE_URL
            ")]
            AppContainerPort --> AppContainer

            DBContainer[("
                **db Container (aidatavault-db-1)**
                PostgreSQL Server
                <em>Listens on 5432 (internal)</em>
                Data: Docker Volume
            ")]

            AppContainer -->|9. SQL Query via DATABASE_URL (to db:5432)| DBContainer
            DBContainer -->|10. SQL Response| AppContainer
        end
        AppContainer -->|11. HTTP Response| HostPort
    end
    HostPort -->|12. HTTP Response| Browser


    subgraph "CI/CD Pipeline (GitHub Actions)"
        direction TB
        GHRepo["GitHub Repository (AIDataVault Code)"] -- Triggers --> GHWorkflow["
            **GitHub Actions Workflow (node-ci.yml)**
            <em>Runs on ubuntu-latest</em>
            1. Checkout code
            2. Setup Node.js
            3. npm ci (in ./server)
            4. npm test (in ./server)
            5. SonarCloud Scan
        "]
        GHWorkflow -->|Sends analysis| SonarCloud(SonarCloud.io)
    end

    classDef dockerComponent fill:#D1E8FF,stroke:#3670A7,stroke-width:2px;
    class AppContainer,DBContainer,AppContainerPort dockerComponent;
    classDef hostComponent fill:#E6FFE6,stroke:#50C878,stroke-width:2px;
    class U,CLI,DComposeFile,Browser,HostPort hostComponent;
    classDef ciComponent fill:#FFF0E6,stroke:#FF8C00,stroke-width:2px;
    class GHRepo,GHWorkflow,SonarCloud ciComponent;
```

## 📂 Project Structure

```
├── client/              # Frontend React application
├── server/              # Backend Node.js API
├── contracts/           # Smart contract definitions (if needed)
├── docs/                # Documentation
├── scripts/             # Utility scripts
└── tests/               # Test suites
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- An account on cheqd Studio for API access
- CHEQ tokens (test tokens available from faucet)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-datavault.git
cd ai-datavault

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start development server
npm run dev
```

### Configuration

Create a `.env` file with the following variables:

```
CHEQD_API_KEY=your_api_key_here
CHEQD_NETWORK=testnet
JWT_SECRET=your_secret_here
IPFS_GATEWAY=your_gateway_url
```

## 🔄 Development Workflow

1. **Setup Identity System**
   - Implement DID creation for users and datasets
   - Create credential schemas for various dataset attributes

2. **Build Marketplace Core**
   - Develop dataset upload and metadata extraction
   - Implement search and discovery features

3. **Create Verification System**
   - Build trust registry integration
   - Implement credential verification flows

4. **Integrate Payment System**
   - Set up CHEQ token integration
   - Implement payment-gated access controls

## 📊 Evaluation Criteria Alignment

This project specifically addresses the hackathon judging criteria:

### Technical Excellence (40 points)
- **Cheqd Capability Implementation (30 points)**
  - Uses DIDs, VCs, Trust Registries, and DID-Linked Resources
  - Implements payment-gated credentials for dataset access
  - Leverages cheqd's blockchain for immutable verification

- **Code Quality (10 points)**
  - Well-structured architecture
  - Comprehensive documentation
  - Testable components

### Innovation & Impact (30 points)
- **Problem-Solution Fit (20 points)**
  - Directly addresses trust issues in AI training data
  - Creates economic incentives for ethical data provision

- **Innovation Level (10 points)**
  - Novel application of verifiable credentials to dataset trust
  - Creates new marketplace dynamics based on verified quality

### Business Viability (15 points)
- Sustainable business model through dataset transaction fees
- Clear value proposition for both data providers and consumers

### Presentation (10 points)
- Clear demonstration of core workflows
- Compelling use cases demonstrated

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [cheqd](https://cheqd.io/) for providing the verifiable credentials infrastructure
- [AI TruthRise Hackathon](https://dorahacks.io/hackathon/cheqd-verifiable-ai) for the inspiration
- All open-source libraries and tools that make this project possible

---

*Built for the cheqd AI TruthRise Hackathon, May 2025*