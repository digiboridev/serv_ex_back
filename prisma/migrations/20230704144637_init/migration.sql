-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('email', 'phone');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('personal', 'company');

-- CreateEnum
CREATE TYPE "OrderStatusType" AS ENUM ('newOrder', 'accepted', 'onDiagnostic', 'offerCreated', 'confirmedOffer', 'declinedOffer', 'waitingForParts', 'inProgress', 'workFinished', 'closed', 'canceled');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUri" TEXT,
    "parentId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueToCategory" (
    "issueId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserContact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyMembers" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "credential" TEXT NOT NULL,
    "credentialType" "CredentialType" NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerInfoId" TEXT NOT NULL,
    "detailsId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerInfo" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerType" "CustomerType" NOT NULL,

    CONSTRAINT "CustomerInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetails" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "issueIds" TEXT[],
    "description" TEXT NOT NULL,
    "deviceWet" BOOLEAN NOT NULL,
    "wetDescription" TEXT,
    "accesoriesIncluded" BOOLEAN NOT NULL,
    "accesoriesDescription" TEXT,
    "hasWaranty" BOOLEAN NOT NULL,
    "password" JSONB,

    CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" TEXT NOT NULL,
    "currentStatus" "OrderStatusType" NOT NULL,
    "acceptedDetails" JSONB,
    "onDiagnosticDetails" JSONB,
    "offerCreatedDetails" JSONB,
    "confirmedOfferDetails" JSONB,
    "declinedOfferDetails" JSONB,
    "waitingForPartsDetails" JSONB,
    "inProgressDetails" JSONB,
    "workFinishedDetails" JSONB,
    "closedDetails" JSONB,
    "cancellDetails" JSONB,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IssueToCategory_issueId_categoryId_key" ON "IssueToCategory"("issueId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserContact_userId_phone_key" ON "UserContact"("userId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_publicId_key" ON "Company"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyMembers_companyId_userId_key" ON "CompanyMembers"("companyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_customerInfoId_key" ON "Order"("customerInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_detailsId_key" ON "Order"("detailsId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_statusId_key" ON "Order"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerInfo_orderId_key" ON "CustomerInfo"("orderId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueToCategory" ADD CONSTRAINT "IssueToCategory_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueToCategory" ADD CONSTRAINT "IssueToCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserContact" ADD CONSTRAINT "UserContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyMembers" ADD CONSTRAINT "CompanyMembers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyMembers" ADD CONSTRAINT "CompanyMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerInfoId_fkey" FOREIGN KEY ("customerInfoId") REFERENCES "CustomerInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "OrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
