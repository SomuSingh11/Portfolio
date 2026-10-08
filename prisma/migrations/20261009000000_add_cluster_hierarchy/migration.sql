ALTER TABLE "LifeCluster" ADD COLUMN "parentId" TEXT;

CREATE INDEX "LifeCluster_parentId_sortOrder_idx" ON "LifeCluster"("parentId", "sortOrder");

ALTER TABLE "LifeCluster"
  ADD CONSTRAINT "LifeCluster_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "LifeCluster"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
