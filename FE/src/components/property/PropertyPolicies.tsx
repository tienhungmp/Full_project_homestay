
import React from 'react';
import { ScrollText } from 'lucide-react';

interface PropertyPoliciesProps {
  policies: {
    checkin: string;
    checkout: string;
    cancellation: string;
    rules: string[];
  };
}

const PropertyPolicies = ({ policies }: PropertyPoliciesProps) => {
  return (
    <div className="p-4 rounded-lg border bg-white">
      <h3 className="font-medium mb-4">Quy định lưu trú</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Thời gian nhận & trả phòng</h4>
          <div className="flex items-center mb-2">
            <ScrollText className="h-4 w-4 mr-2" />
            <span>Nhận phòng: {policies.checkin}</span>
          </div>
          <div className="flex items-center">
            <ScrollText className="h-4 w-4 mr-2" />
            <span>Trả phòng: {policies.checkout}</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Chính sách hủy phòng</h4>
          <p className="text-muted-foreground">{policies.cancellation}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Nội quy chỗ ở</h4>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          {policies.rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PropertyPolicies;
