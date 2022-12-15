CREATE TABLE public."Account" (
  "AccountId" SERIAL,
  "EmployeeId" int4 NOT NULL UNIQUE,
  "Password" varchar(255) NOT NULL DEFAULT 'passw0rD$',
  CONSTRAINT "PK_Account" PRIMARY KEY ("AccountId"),
  CONSTRAINT "FK_AccountEmployeeId" FOREIGN KEY ("EmployeeId") REFERENCES public."Employee"("EmployeeId")
);
INSERT INTO public."Account" ("EmployeeId")
SELECT "EmployeeId"
FROM public."Employee";