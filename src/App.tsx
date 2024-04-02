import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import OutlinedInput from '@mui/material/OutlinedInput';
import { MenuProps } from '@mui/material/Menu';
import { Button, CircularProgress } from '@mui/material';
import './App.css';

interface Product {
  id: number;
  title: string;
  category: string;
}

const App: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  
  const [categories, setCategories] = useState<string[]>([]);
 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [chartOptions, setChartOptions] = useState<any>(null);
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [pieChartVisible, setPieChartVisible] = useState<boolean>(true);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then((data: { products: Product[] }) => {
        console.log('Fetched products:', data.products);
        setProducts(data.products);

        const uniqueCategories = Array.from(new Set(data.products.map(product => product.category)));
        setCategories(uniqueCategories);

        const pieChartData = uniqueCategories.map(category => ({
          name: category,
          y: data.products.filter(product => product.category === category).length,
        }));
        const pieChartOptions = {
          chart: {
            type: 'pie',
          },
          title: {
            text: 'Product Distribution by Category',
          },
          series: [
            {
              name: 'Products',
              data: pieChartData,
            },
          ],
        };
  
       
        setChartOptions(pieChartOptions);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleCategorySelectChanges = (event: SelectChangeEvent<any>) => {
    setSelectedCategory(event.target.value);
    setSelectedProducts([]);
  };

  
  const handleProductSelectChanges = (event: SelectChangeEvent<any>) => {
    const selectedProductIds = event.target.value as (string | number)[]; // Allow both string and number values
    const selectedProducts = products.filter(product => selectedProductIds.includes(product.id));
    setSelectedProducts(selectedProducts);
  };
 
const handleRunButtonClick = () => {
  if (selectedCategory && selectedProducts.length > 0) {
    setLoading(true);
    setTimeout(() => {
      const chartData = selectedProducts.map(product => ({
        name: product.title,
        y: Math.random() * 100,
      }));
      const options = {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Product Distribution',
        },
        xAxis: {
          categories: selectedProducts.map(product => product.title),
        },
        yAxis: {
          title: {
            text: 'Value',
          },
        },
        series: [
          {
            name: 'Value',
            data: chartData,
          },
        ],
      };
      setChartOptions(options);
      setLoading(false);
      setPieChartVisible(false);
    }, 2000);
  } else {
    setPieChartVisible(true); 
  }
};

  

  const handleClearButtonClick = () => {
    setSelectedCategory(null);
    setSelectedProducts([]);
    setLoading(false);
    const pieChartData = categories.map(category => ({
      name: category,
      y: products.filter(product => product.category === category).length,
    }));
    const pieChartOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Product Distribution by Category',
      },
      series: [
        {
          name: 'Products',
          data: pieChartData,
        },
      ],
    };
    setChartOptions(pieChartOptions);
    setPieChartVisible(true);
  };
  
  return (
    <div>

        <div className="wrapper">
          <header className="header">Product Filter with High Chart</header>
            <section className="content">
              <div className="columns">
                <aside className="sidebar">
                  <div className="column" >
                    <div className="filter-title">
                      <h1>Filters</h1>
                      <button onClick={handleClearButtonClick}>Clear</button>
                    </div>
                    <Box sx={{ minWidth: 300 }}>
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          value={(selectedCategory || '') as any}
                          onChange={handleCategorySelectChanges}
                        >
                          {/* <MenuItem value="" >Select category</MenuItem> */}
                          {categories.map(category => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    {selectedCategory && (
                      <div>
                        <h1>Select products:</h1>
                        
                          <FormControl sx={{ m: 1, width: 300 }}>
                                  <InputLabel id="demo-multiple-name-label">Products</InputLabel>
                              <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={(selectedProducts.map(product => product.id))as any}
                                onChange={handleProductSelectChanges}
                                input={<OutlinedInput label="Name" />}
                              >
                                {products
                                    .filter(product => product.category === selectedCategory)
                                    .map(product => (
                                      <MenuItem key={product.id} value={product.id}>
                                        {product.title}
                                        </MenuItem>
                                    ))}
                              
                              </Select>
                            </FormControl>
                      </div>
                    )}
                </div>
              <button  className="sub-btn" onClick={handleRunButtonClick} disabled={!selectedCategory || selectedProducts.length === 0 || loading}>
              Run Report
                    </button>{loading && <div className='load-ico'> <CircularProgress /></div>}
                   
                </aside>
                <main className="main">
                
                {/* {pieChartVisible && !loading && (
                  <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                  )} */}
          {pieChartVisible && !loading && chartOptions  && (
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          )}

          {!pieChartVisible && selectedCategory && !loading && chartOptions && (
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          )}

                  </main>
                
              </div>
            </section>
          {/* <footer className="footer">pravinyoy.com</footer> */}
        </div>
      
    </div>
  );
};

export default App;
