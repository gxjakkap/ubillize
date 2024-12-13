import { BillsTableLoading } from "@/components/tenant/bills-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function TenantPageLoading (){
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary ml-4">Ubillize</h1>
            </div>
            <Button type="submit" variant="ghost" className="text-lg">Sign Out</Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Tenant Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-4">
              <div className="inline-flex"><p className="text-lg font-bold">Name:</p> <div className="w-10 h-6 animate-pulse"></div></div>
              <div className="inline-flex"><p className="text-lg font-bold">Room Number:</p> <div className="w-10 h-6 animate-pulse"></div></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <BillsTableLoading />
              </div>
            </CardContent>
          </Card>
        </div>
    )
}