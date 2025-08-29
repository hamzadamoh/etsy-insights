
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export function TrendingKeywordsTable() {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Trending keywords</h2>
        <p className="text-sm text-muted-foreground">167,000 keywords</p>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Search volume</TableHead>
              <TableHead>3mo. change</TableHead>
              <TableHead>Competition</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>pope leo xiv</TableCell>
              <TableCell>673,000</TableCell>
              <TableCell>76,887,200%</TableCell>
              <TableCell>5,782</TableCell>
              <TableCell>10,824</TableCell>
              <TableCell>100</TableCell>
              <TableCell>📈</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>leo xiv</TableCell>
              <TableCell>165,000</TableCell>
              <TableCell>62,348,700%</TableCell>
              <TableCell>5,783</TableCell>
              <TableCell>10,824</TableCell>
              <TableCell>100</TableCell>
              <TableCell>📈</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>real time stock tracker</TableCell>
              <TableCell>165,000</TableCell>
              <TableCell>7,887,100%</TableCell>
              <TableCell>17</TableCell>
              <TableCell>1,500</TableCell>
              <TableCell>89</TableCell>
              <TableCell>📈</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>pokemon van gogh</TableCell>
              <TableCell>27,100</TableCell>
              <TableCell>5,785,000%</TableCell>
              <TableCell>326</TableCell>
              <TableCell>637</TableCell>
              <TableCell>94</TableCell>
              <TableCell>📈</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
