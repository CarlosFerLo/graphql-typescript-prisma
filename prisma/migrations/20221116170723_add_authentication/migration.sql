-- CreateTable
CREATE TABLE "AuthPayload" (
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AuthPayload_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthPayload_userId_key" ON "AuthPayload"("userId");

-- AddForeignKey
ALTER TABLE "AuthPayload" ADD CONSTRAINT "AuthPayload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
